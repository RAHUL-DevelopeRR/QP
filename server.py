from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
import io
import os
import json
import requests
import re

# =============================================================================
# ENVIRONMENT LOADING (must happen BEFORE Flask app creation)
# =============================================================================
# Load .env file for LOCAL development only
# In production (Railway), environment variables are injected directly
# Railway sets RAILWAY_ENVIRONMENT variable in production

def load_environment():
    """Load environment variables from .env file in local development."""
    # Skip dotenv loading in Railway production
    if os.environ.get('RAILWAY_ENVIRONMENT') or os.environ.get('RAILWAY_PROJECT_ID'):
        print("🚂 Running on Railway - using injected environment variables")
        return
    
    # Local development: try to load .env.local or .env
    try:
        from dotenv import load_dotenv
        
        # Check for .env.local first (Vite convention), then .env
        env_file = None
        if os.path.exists('.env.local'):
            env_file = '.env.local'
        elif os.path.exists('.env'):
            env_file = '.env'
        
        if env_file:
            load_dotenv(env_file, override=True)
            print(f"📄 Loaded environment from {env_file}")
        else:
            print("⚠️  No .env file found (create .env.local with API_KEY=your-key)")
    except ImportError:
        print("⚠️  python-dotenv not installed (run: pip install python-dotenv)")

# Load environment BEFORE creating Flask app
load_environment()

# Import the document generator
from IDLE import create_exam_paper

app = Flask(__name__, static_folder='dist')
CORS(app)  # Enable CORS for React frontend

# Constants
PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions'
SYSTEM_PROMPT = """You are an Academic Question Bank Generation Engine designed for Indian engineering colleges.

ROLE & RESPONSIBILITY:
1. Parse provided CDAP, Syllabus, and Template.
2. Generate a high-quality question bank with:
   - DIAGRAMMATIC QUESTIONS: Questions requiring students to draw diagrams (flowcharts, UML, ER diagrams, trees, graphs, state diagrams, timing diagrams, memory layouts, etc.)
   - PROBLEM-SOLVING QUESTIONS: Numerical and algorithmic problems requiring step-by-step solutions (calculations, algorithm traces, table constructions, etc.)
3. Ensure Bloom's Taxonomy rules:
   - 2 Marks: BTL 2 (Understand), BTL 3 (Apply), BTL 4 (Analyze).
   - 16 Marks: BTL 3 (Apply), BTL 4 (Analyze), BTL 5 (Evaluate).
4. For Each Long Question (16 marks):
   - Include diagrammatic components where applicable
   - Include step-by-step problem solving with intermediate results
   - Provide clear marking scheme

QUESTION TYPES TO GENERATE:
- Draw/Illustrate/Construct (Diagrammatic)
- Trace/Solve/Calculate (Problem-based)
- Compare with diagrams (Comparative)
- Design and implement with flowchart (Design-based)

Strictly follow the syllabus units and topics.
"""

# Helper Functions
def extract_json(text):
    """Extract JSON from text response (handles markdown code blocks)"""
    # Try to extract JSON from markdown code block
    json_match = re.search(r'```json\s*([\s\S]*?)\s*```', text)
    if json_match:
        return json_match.group(1).strip()
    
    # Try to find array or object directly
    array_match = re.search(r'\[[\s\S]*\]', text)
    if array_match:
        return array_match.group(0)
    
    object_match = re.search(r'\{[\s\S]*\}', text)
    if object_match:
        return object_match.group(0)
    
    return text

def call_perplexity_api(prompt):
    """
    Securely call Perplexity API with API key from environment.
    NEVER exposes API key to frontend.
    """
    api_key = os.environ.get('API_KEY')
    if not api_key:
        raise ValueError("API_KEY not configured on server")
    
    response = requests.post(
        PERPLEXITY_API_URL,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'sonar',
            'messages': [
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.4,
            'max_tokens': 8000
        },
        timeout=120  # 2 minute timeout
    )
    
    if not response.ok:
        error_msg = f"Perplexity API error: {response.status_code}"
        try:
            error_detail = response.json()
            print(f"API Error Details: {error_detail}")
        except:
            pass
        raise Exception(error_msg)
    
    result = response.json()
    return result['choices'][0]['message']['content']


def get_cia_constraints(faculty_selection):
    """Generate CIA-specific constraints for prompts"""
    cia_type = faculty_selection.get('ciaType', 'CIA-I')
    qp_type = faculty_selection.get('qpType', 'QP-I')
    
    unit_constraint = (
        'Unit I and Unit II ONLY. DO NOT include questions from Unit III, IV, or V.'
        if cia_type == 'CIA-I'
        else 'Unit III and Unit IV ONLY. DO NOT include questions from Unit I, II, or V.'
    )
    
    co_constraint = (
        'CO1 and CO2 ONLY. DO NOT use CO3 or CO4.'
        if cia_type == 'CIA-I'
        else 'CO3 and CO4 ONLY. DO NOT use CO1 or CO2.'
    )
    
    if qp_type == 'QP-I':
        pattern_constraint = """
QP Type I Pattern (Total 60 marks):
- Part A: 6 questions × 2 marks = 12 marks (BTL 2-3)
- Part B: 4 question pairs with OR choice × 12 marks = 48 marks (BTL 3-5)"""
    else:
        pattern_constraint = """
QP Type II Pattern (Total 60 marks):
- Part A: 6 questions × 2 marks = 12 marks (BTL 2-3)
- Part B: 2 question pairs with OR choice × 16 marks = 32 marks (BTL 3-5)
- Part C: 1 question pair with OR choice × 16 marks = 16 marks (BTL 4-5, Application/Analysis)"""
    
    return f"""
MANDATORY CONSTRAINTS:
1. Questions MUST be from: {unit_constraint}
2. Course Outcomes MUST be: {co_constraint}
3. {pattern_constraint}
"""


@app.route('/api/generate-bank', methods=['POST'])
def generate_bank():
    """
    Generate question bank by proxying to Perplexity API.
    API key is read from server environment (secure).
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['cdap', 'syllabus', 'template', 'facultySelection']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Extract data
        cdap = data['cdap']
        syllabus = data['syllabus']
        template = data['template']
        faculty_selection = data['facultySelection']
        
        constraints = get_cia_constraints(faculty_selection)
        cia_type = faculty_selection.get('ciaType', 'CIA-I')
        units = [1, 2] if cia_type == 'CIA-I' else [3, 4]
        cos = ['CO1', 'CO2'] if cia_type == 'CIA-I' else ['CO3', 'CO4']
        
        # Build prompt
        prompt = f"""
INPUTS:

[CDAP]
{cdap}

[SYLLABUS]
{syllabus}

[TEMPLATE]
{template}

{constraints}

TASK:
Generate a comprehensive Question Bank for {cia_type}.
Return ONLY a valid JSON array of objects with NO markdown formatting.
Generate at least 8 questions for Part A (2 marks) and 6 questions for Part B (12 or 16 marks).

STRICT RULES:
- Only use Units: {', '.join(map(str, units))}
- Only use COs: {', '.join(cos)}

Each question object must have these exact fields:
{{
  "id": "string (unique identifier like Q1, Q2, etc.)",
  "text": "string (the question text)",
  "marks": number (2 for Part A, 12 or 16 for Part B/C),
  "unit": number ({' or '.join(map(str, units))} ONLY),
  "topic": "string",
  "subtopic": "string",
  "co": "string ({' or '.join(cos)} ONLY)",
  "btl": "string (BTL1, BTL2, etc.)",
  "difficulty": "Easy" | "Medium" | "Hard",
  "type": "Theory" | "Problem" | "Diagram" | "Numerical"
}}

Return ONLY the JSON array, no explanation or markdown.
"""
        
        # Call Perplexity API securely
        result = call_perplexity_api(prompt)
        json_str = extract_json(result)
        questions = json.loads(json_str)
        
        return jsonify({"questions": questions})
    
    except ValueError as e:
        # API key not configured
        return jsonify({"error": str(e)}), 500
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out. Please try again."}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to connect to AI service"}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": "Failed to parse AI response"}), 500
    except Exception as e:
        print(f"Error in generate_bank: {e}")
        return jsonify({"error": "Failed to generate question bank"}), 500


@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    """
    Generate formatted question paper text by proxying to Perplexity API.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['bank', 'template', 'syllabus', 'facultySelection']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        bank = data['bank']
        template = data['template']
        syllabus = data['syllabus']
        faculty_selection = data['facultySelection']
        
        bank_json = json.dumps(bank)
        cia_type = faculty_selection.get('ciaType', 'CIA-I')
        qp_type = faculty_selection.get('qpType', 'QP-I')
        course_code = faculty_selection.get('courseCode', '')
        course_title = faculty_selection.get('courseTitle', '')
        cia_label = 'CIA-1' if cia_type == 'CIA-I' else 'CIA-2'
        
        # Build comprehensive prompt (simplified for brevity)
        prompt = f"""
TASK:
Generate a final formatted Question Paper based on the Question Bank provided below.

[TEMPLATE RULES]
{template}

[QUESTION BANK]
{bank_json}

[REQUIRED FORMAT - FOLLOW THIS EXACTLY]
Generate the question paper with COMPLETE HEADER and body.

Course Code: {course_code}
Course Title: {course_title}
CIA Type: {cia_label}

PART A (6X2 MARKS = 12 MARKS)
PART B ({'4X12 MARKS = 48 MARKS' if qp_type == 'QP-I' else '2X16 MARKS = 32 MARKS'})
{'PART C (1X16 MARKS = 16 MARKS)' if qp_type == 'QP-II' else ''}

Output ONLY the formatted paper, no JSON.
"""
        
        # Call Perplexity API
        result = call_perplexity_api(prompt)
        
        return jsonify({"paper": result})
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Error in generate_paper: {e}")
        return jsonify({"error": "Failed to generate question paper"}), 500


@app.route('/api/generate-paper-data', methods=['POST'])
def generate_paper_data():
    """
    Generate structured question paper data for Word export.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['bank', 'template', 'syllabus', 'facultySelection']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        bank = data['bank']
        template = data['template']
        syllabus = data['syllabus']
        faculty_selection = data['facultySelection']
        
        bank_json = json.dumps(bank)
        cia_type = faculty_selection.get('ciaType', 'CIA-I')
        qp_type = faculty_selection.get('qpType', 'QP-I')
        course_code = faculty_selection.get('courseCode', '')
        course_title = faculty_selection.get('courseTitle', '')
        cos = ['CO1', 'CO2'] if cia_type == 'CIA-I' else ['CO3', 'CO4']
        
        # Build prompt
        prompt = f"""
TASK:
Generate structured question paper data as JSON for Word document generation.

[QUESTION BANK]
{bank_json}

[INSTRUCTIONS]
1. Use course code: {course_code}, course name: {course_title}
2. CIA Type: {cia_type}, QP Type: {qp_type}
3. ONLY use COs: {', '.join(cos)}
4. Select 6 questions for Part A (2 marks each) from the question bank
5. Use proper question numbering format: 7.(a), 7.(b), 8.(a), etc.
6. For OR rows, use {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}}

Return a JSON object with this EXACT structure:
{{
  "department": "CSE",
  "section": "A",
  "semester": "IV",
  "dateSession": "2025-02-27 (FN)",
  "courseCode": "{course_code}",
  "courseName": "{course_title}",
  "ciaType": "{cia_type}",
  "qpType": "{qp_type}",
  "partAQuestions": [
    {{"qno": "1.", "question": "...", "co": "{cos[0]}", "btl": "BTL2", "marks": "2"}},
    {{"qno": "2.", "question": "...", "co": "{cos[0]}", "btl": "BTL2", "marks": "2"}},
    {{"qno": "3.", "question": "...", "co": "{cos[0]}", "btl": "BTL2", "marks": "2"}},
    {{"qno": "4.", "question": "...", "co": "{cos[1]}", "btl": "BTL2", "marks": "2"}},
    {{"qno": "5.", "question": "...", "co": "{cos[1]}", "btl": "BTL2", "marks": "2"}},
    {{"qno": "6.", "question": "...", "co": "{cos[1]}", "btl": "BTL2", "marks": "2"}}
  ],
  "partBQuestions": [...],
  "partCQuestions": [...]  // Only if QP-II
}}

Return ONLY the JSON object, no explanation or markdown.
"""
        
        # Call Perplexity API
        result = call_perplexity_api(prompt)
        json_str = extract_json(result)
        paper_data = json.loads(json_str)
        
        return jsonify({"paperData": paper_data})
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": "Failed to parse AI response"}), 500
    except Exception as e:
        print(f"Error in generate_paper_data: {e}")
        return jsonify({"error": "Failed to generate paper data"}), 500


@app.route('/api/generate-docx', methods=['POST'])
def generate_docx():
    """
    Generate a Word document from question data.
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract parameters with defaults
        department = data.get('department', 'CSBS')
        section = data.get('section', 'A')
        semester = data.get('semester', 'IV')
        date_session = data.get('dateSession', '2025-02-27 (FN)')
        course_code = data.get('courseCode', 'CBB1222')
        course_name = data.get('courseName', 'Operating Systems')
        cia_type = data.get('ciaType', 'CIA-I')
        qp_type = data.get('qpType', 'QP-I')
        part_a_questions = data.get('partAQuestions', None)
        part_b_questions = data.get('partBQuestions', None)
        part_c_questions = data.get('partCQuestions', None)
        
        # Generate the document
        doc_bytes = create_exam_paper(
            department=department,
            section_val=section,
            semester=semester,
            date_session=date_session,
            course_code=course_code,
            course_name=course_name,
            cia_type=cia_type,
            qp_type=qp_type,
            part_a_questions=part_a_questions,
            part_b_questions=part_b_questions,
            part_c_questions=part_c_questions,
            output_path=None  # Return bytes
        )
        
        # Send file as download
        return send_file(
            io.BytesIO(doc_bytes),
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name=f'{cia_type}_Question_Paper.docx'
        )
        
    except Exception as e:
        print(f"Error generating document: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    api_key_configured = os.environ.get('API_KEY') is not None
    return jsonify({
        "status": "ok",
        "message": "Server is running",
        "api_configured": api_key_configured
    })


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve React static files"""
    try:
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            # Serve index.html for all routes (SPA routing)
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(app.static_folder, 'index.html')
            else:
                return jsonify({
                    "error": "Frontend not built",
                    "message": "Please run 'npm run build' to create the dist folder",
                    "static_folder": app.static_folder,
                    "exists": os.path.exists(app.static_folder)
                }), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Get port from environment variable (Railway) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    print("🚀 Starting Flask API server...")
    print(f"🌐 Port: {port}")
    print(f"📁 Static folder: {app.static_folder}")
    print(f"📁 Static folder exists: {os.path.exists(app.static_folder)}")
    
    # Check if dist folder has content
    if os.path.exists(app.static_folder):
        files = os.listdir(app.static_folder)
        print(f"📦 Static files: {files[:5]}..." if len(files) > 5 else f"📦 Static files: {files}")
    else:
        print("⚠️  WARNING: dist folder not found! Run 'npm run build' first")
    
    # Check API key (don't print the actual key)
    api_key = os.environ.get('API_KEY')
    if api_key:
        print(f"🔑 API Key: Configured (starts with {api_key[:8]}...)")
    else:
        print("⚠️  WARNING: API_KEY environment variable not set!")
    
    print("📄 API Endpoints:")
    print("   POST /api/generate-bank - Generate question bank")
    print("   POST /api/generate-paper - Generate formatted paper")
    print("   POST /api/generate-paper-data - Generate structured data")
    print("   POST /api/generate-docx - Generate Word document")
    print("   GET  /api/health - Health check")
    print("=" * 50)
    
    # Disable debug mode in production (Railway sets PORT env var)
    debug_mode = os.environ.get('PORT') is None
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
