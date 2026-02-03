"""
Flask Backend for AcademicGen Engine
=====================================
- Proxies AI API calls (secure - API key on server only)
- Generates Word documents via IDLE.py
- Works on both local dev (dotenv) and Railway production
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import os
import json
import requests

# =============================================================================
# ENVIRONMENT LOADING (Local dev uses .env.local, Railway uses injected vars)
# =============================================================================
def load_environment():
    """Load environment variables for local development."""
    # Skip dotenv in Railway production
    if os.environ.get('RAILWAY_ENVIRONMENT') or os.environ.get('RAILWAY_PROJECT_ID'):
        print("🚂 Running on Railway - using injected environment variables")
        return
    
    # Local development: try to load .env.local or .env
    try:
        from dotenv import load_dotenv
        
        env_file = None
        if os.path.exists('.env.local'):
            env_file = '.env.local'
        elif os.path.exists('.env'):
            env_file = '.env'
        
        if env_file:
            load_dotenv(env_file, override=True)
            print(f"📄 Loaded environment from {env_file}")
        else:
            print("⚠️ No .env file found (create .env.local with API_KEY=your-key)")
    except ImportError:
        print("⚠️ python-dotenv not installed (run: pip install python-dotenv)")

# Load environment BEFORE creating Flask app
load_environment()

# Import the document generator
from IDLE import create_exam_paper

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# =============================================================================
# PERPLEXITY API CONFIGURATION
# =============================================================================
PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions'

SYSTEM_PROMPT = """You are an expert academic question paper generator for M. Kumarasamy College of Engineering, following Anna University exam patterns strictly.

CRITICAL RULES:
1. Questions must be academically rigorous and examination-appropriate
2. Each question must have clear CO (Course Outcome) and BTL (Bloom's Taxonomy Level) mapping
3. Generate questions strictly from the provided syllabus topics ONLY
4. Never create questions outside the given unit boundaries
5. Ensure variety in question types (Define, Explain, Compare, Analyze, Design, Evaluate)
6. Match the difficulty distribution specified in the template"""


def get_api_key():
    """Get API key from environment."""
    api_key = os.environ.get('API_KEY')
    if not api_key:
        raise ValueError("API_KEY not configured in environment")
    return api_key


def call_perplexity_api(prompt: str) -> str:
    """Call Perplexity API with the given prompt."""
    api_key = get_api_key()
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    
    payload = {
        'model': 'sonar',
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.4,
        'max_tokens': 8000,
    }
    
    response = requests.post(PERPLEXITY_API_URL, json=payload, headers=headers, timeout=120)
    response.raise_for_status()
    
    data = response.json()
    return data['choices'][0]['message']['content']


def extract_json(text: str) -> str:
    """Extract JSON from AI response."""
    import re
    
    # Try to extract from markdown code block
    json_match = re.search(r'```json\s*([\s\S]*?)\s*```', text)
    if json_match:
        return json_match.group(1).strip()
    
    # Try to find array directly
    array_match = re.search(r'\[[\s\S]*\]', text)
    if array_match:
        return array_match.group(0)
    
    # Try to find object directly
    object_match = re.search(r'\{[\s\S]*\}', text)
    if object_match:
        return object_match.group(0)
    
    return text


def get_cia_constraints(faculty_selection: dict) -> str:
    """Get CIA-specific constraints for prompt."""
    cia_type = faculty_selection.get('ciaType', 'CIA-I')
    qp_type = faculty_selection.get('qpType', 'QP-I')
    
    unit_constraint = ('Unit I and Unit II ONLY' if cia_type == 'CIA-I' 
                      else 'Unit III and Unit IV ONLY')
    co_constraint = ('CO1 and CO2 ONLY' if cia_type == 'CIA-I' 
                    else 'CO3 and CO4 ONLY')
    
    if qp_type == 'QP-I':
        pattern_constraint = """QP Type I Pattern (Total 60 marks):
- Part A: 6 questions × 2 marks = 12 marks (BTL 2-3)
- Part B: 4 question pairs with OR choice × 12 marks = 48 marks (BTL 3-5)"""
    else:
        pattern_constraint = """QP Type II Pattern (Total 60 marks):
- Part A: 6 questions × 2 marks = 12 marks (BTL 2-3)
- Part B: 2 question pairs with OR choice × 16 marks = 32 marks (BTL 3-5)
- Part C: 1 question pair with OR choice × 16 marks = 16 marks (BTL 4-5)"""
    
    return f"""MANDATORY CONSTRAINTS:
1. Questions MUST be from: {unit_constraint}
2. Course Outcomes MUST be: {co_constraint}
3. {pattern_constraint}"""


# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    api_key = os.environ.get('API_KEY')
    return jsonify({
        "status": "ok",
        "message": "Server is running",
        "api_configured": bool(api_key)
    })


@app.route('/api/generate-bank', methods=['POST'])
def generate_bank():
    """Generate question bank via Perplexity API."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        cdap = data.get('cdap', '')
        syllabus = data.get('syllabus', '')
        template = data.get('template', '')
        faculty_selection = data.get('facultySelection', {})
        
        constraints = get_cia_constraints(faculty_selection)
        cia_type = faculty_selection.get('ciaType', 'CIA-I')
        units = [1, 2] if cia_type == 'CIA-I' else [3, 4]
        cos = ['CO1', 'CO2'] if cia_type == 'CIA-I' else ['CO3', 'CO4']
        
        prompt = f"""INPUTS:

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

Return ONLY the JSON array, no explanation or markdown."""
        
        result = call_perplexity_api(prompt)
        json_str = extract_json(result)
        questions = json.loads(json_str)
        
        return jsonify({"questions": questions})
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out. Please try again."}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"AI service error: {str(e)}"}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": "Failed to parse AI response"}), 500
    except Exception as e:
        print(f"Error in generate_bank: {e}")
        return jsonify({"error": "Failed to generate question bank"}), 500


@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    """Generate formatted question paper text."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        bank = data.get('bank', [])
        template = data.get('template', '')
        syllabus = data.get('syllabus', '')
        faculty_selection = data.get('facultySelection', {})
        
        cia_type = faculty_selection.get('ciaType', 'CIA-I')
        qp_type = faculty_selection.get('qpType', 'QP-I')
        course_code = faculty_selection.get('courseCode', '')
        course_title = faculty_selection.get('courseTitle', '')
        cia_label = 'CIA-1' if cia_type == 'CIA-I' else 'CIA-2'
        
        bank_json = json.dumps(bank)
        
        if qp_type == 'QP-I':
            co1 = 'CO1' if cia_type == 'CIA-I' else 'CO3'
            co2 = 'CO2' if cia_type == 'CIA-I' else 'CO4'
            part_b_pattern = f"""
============================================================
PART -B (4X12 MARKS = 48 MARKS)
============================================================

Q.NO    Question                                              CO    BTL   MARKS
7.a     [Question]                                            {co1}   BTL3   12
                              (OR)
7.b     [Alternative]                                         {co1}   BTL3   12
8.a     [Question]                                            {co1}   BTL3   12
                              (OR)
8.b     [Alternative]                                         {co1}   BTL4   12
9.a     [Question]                                            {co2}   BTL3   12
                              (OR)
9.b     [Alternative]                                         {co2}   BTL4   12
10.a    [Question]                                            {co2}   BTL4   12
                              (OR)
10.b    [Alternative]                                         {co2}   BTL3   12"""
        else:
            co1 = 'CO1' if cia_type == 'CIA-I' else 'CO3'
            co2 = 'CO2' if cia_type == 'CIA-I' else 'CO4'
            part_b_pattern = f"""
============================================================
PART -B (2X16 MARKS = 32 MARKS)
============================================================

Q.NO    Question                                              CO    BTL   MARKS
7.a     [Question]                                            {co1}   BTL3   16
                              (OR)
7.b     [Alternative]                                         {co1}   BTL4   16
8.a     [Question]                                            {co2}   BTL4   16
                              (OR)
8.b     [Alternative]                                         {co2}   BTL3   16

============================================================
PART -C (1X16 MARKS = 16 MARKS)
============================================================

Q.NO    Question                                              CO    BTL   MARKS
9.a     [Application/Analysis question]                       {co1}   BTL4   16
                              (OR)
9.b     [Alternative]                                         {co2}   BTL5   16"""
        
        prompt = f"""TASK:
Generate a final formatted Question Paper based on the Question Bank provided.

[TEMPLATE RULES]
{template}

[QUESTION BANK]
{bank_json}

[REQUIRED FORMAT]
Generate the question paper with header and body:

================================================================================
                        M.Kumarasamy College of Engineering
                        NAAC Accredited Autonomous Institution
================================================================================

                                    {cia_label}

REG No: |___|___|___|___|___|___|___|___|___|___|___|___|

DEPARTMENT: [From syllabus]    SEMESTER: [e.g. IV]
SECTION: [e.g. A]              DATE & SESSION: [YYYY-MM-DD (FN)]
DURATION: 120 Minutes          MAX MARKS: 60
COURSE CODE & NAME: {course_code} - {course_title}

============================================================
PART -A (6X2 MARKS = 12 MARKS)
============================================================

Q.NO    Question                                              CO    BTL   MARKS
1.      [Question]                                            {co1}   BTL2    2
2.      [Question]                                            {co1}   BTL2    2
3.      [Question]                                            {co1}   BTL2    2
4.      [Question]                                            {co2}   BTL3    2
5.      [Question]                                            {co2}   BTL2    2
6.      [Question]                                            {co2}   BTL2    2

{part_b_pattern}

Output ONLY the formatted paper, no JSON."""
        
        result = call_perplexity_api(prompt)
        return jsonify({"paper": result})
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Error in generate_paper: {e}")
        return jsonify({"error": "Failed to generate paper"}), 500


@app.route('/api/generate-paper-data', methods=['POST'])
def generate_paper_data():
    """Generate structured question paper data for Word document."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        bank = data.get('bank', [])
        template = data.get('template', '')
        syllabus = data.get('syllabus', '')
        faculty_selection = data.get('facultySelection', {})
        
        cia_type = faculty_selection.get('ciaType', 'CIA-I')
        qp_type = faculty_selection.get('qpType', 'QP-I')
        course_code = faculty_selection.get('courseCode', '')
        course_title = faculty_selection.get('courseTitle', '')
        
        cos = ['CO1', 'CO2'] if cia_type == 'CIA-I' else ['CO3', 'CO4']
        bank_json = json.dumps(bank)
        
        if qp_type == 'QP-I':
            structure_desc = f'''"partBQuestions": [
    {{"qno": "7.(a)", "question": "...", "co": "{cos[0]}", "btl": "BTL3", "marks": "12"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "7.(b)", "question": "...", "co": "{cos[0]}", "btl": "BTL3", "marks": "12"}},
    {{"qno": "8.(a)", "question": "...", "co": "{cos[0]}", "btl": "BTL3", "marks": "12"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "8.(b)", "question": "...", "co": "{cos[0]}", "btl": "BTL4", "marks": "12"}},
    {{"qno": "9.(a)", "question": "...", "co": "{cos[1]}", "btl": "BTL3", "marks": "12"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "9.(b)", "question": "...", "co": "{cos[1]}", "btl": "BTL4", "marks": "12"}},
    {{"qno": "10.(a)", "question": "...", "co": "{cos[1]}", "btl": "BTL3", "marks": "12"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "10.(b)", "question": "...", "co": "{cos[1]}", "btl": "BTL3", "marks": "12"}}
]'''
        else:
            structure_desc = f'''"partBQuestions": [
    {{"qno": "7.(a)", "question": "...", "co": "{cos[0]}", "btl": "BTL3", "marks": "16"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "7.(b)", "question": "...", "co": "{cos[0]}", "btl": "BTL4", "marks": "16"}},
    {{"qno": "8.(a)", "question": "...", "co": "{cos[1]}", "btl": "BTL4", "marks": "16"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "8.(b)", "question": "...", "co": "{cos[1]}", "btl": "BTL3", "marks": "16"}}
],
"partCQuestions": [
    {{"qno": "9.(a)", "question": "...", "co": "{cos[0]}", "btl": "BTL4", "marks": "16"}},
    {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}},
    {{"qno": "9.(b)", "question": "...", "co": "{cos[1]}", "btl": "BTL5", "marks": "16"}}
]'''
        
        prompt = f"""TASK:
Generate structured question paper data as JSON for Word document generation.

[TEMPLATE RULES]
{template}

[SYLLABUS]
{syllabus}

[QUESTION BANK]
{bank_json}

[INSTRUCTIONS]
1. Use course code: {course_code}, course name: {course_title}
2. CIA Type: {cia_type}, QP Type: {qp_type}
3. ONLY use COs: {', '.join(cos)}
4. Select 6 questions for Part A (2 marks each)
5. {'Select 8 questions for Part B (4 pairs with OR, 12 marks each)' if qp_type == 'QP-I' else 'Select 4 for Part B (16 marks) + 2 for Part C (16 marks)'}
6. Return ONLY valid JSON with NO markdown
7. For OR rows: {{"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}}
8. Question numbers: 7.(a), 7.(b), 8.(a), 8.(b), etc.

Return JSON object with this structure:
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
  {structure_desc}
}}

Return ONLY the JSON, no explanation."""
        
        result = call_perplexity_api(prompt)
        json_str = extract_json(result)
        paper_data = json.loads(json_str)
        
        return jsonify({"paperData": paper_data})
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Error in generate_paper_data: {e}")
        return jsonify({"error": "Failed to generate paper data"}), 500


@app.route('/api/generate-docx', methods=['POST'])
def generate_docx():
    """Generate a Word document from question data."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract parameters
        department = data.get('department', 'CSBS')
        section_val = data.get('section', 'A')
        semester = data.get('semester', 'IV')
        date_session = data.get('dateSession', '2025-02-27 (FN)')
        course_code = data.get('courseCode', 'CBB1222')
        course_name = data.get('courseName', 'Operating Systems')
        cia_type = data.get('ciaType', 'CIA-I')
        qp_type = data.get('qpType', 'QP-I')
        part_a_questions = data.get('partAQuestions', None)
        part_b_questions = data.get('partBQuestions', None)
        part_c_questions = data.get('partCQuestions', None)
        
        # Generate document
        doc_bytes = create_exam_paper(
            department=department,
            section_val=section_val,
            semester=semester,
            date_session=date_session,
            course_code=course_code,
            course_name=course_name,
            cia_type=cia_type,
            qp_type=qp_type,
            part_a_questions=part_a_questions,
            part_b_questions=part_b_questions,
            part_c_questions=part_c_questions
        )
        
        # Create filename
        filename = f"CIA_Paper_{course_code}_{cia_type}_{qp_type}.docx"
        
        return send_file(
            io.BytesIO(doc_bytes),
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        print(f"Error generating document: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    api_key = os.environ.get('API_KEY')
    if api_key:
        print(f"✅ API_KEY configured (length: {len(api_key)})")
    else:
        print("⚠️ API_KEY not found in environment")
    
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
