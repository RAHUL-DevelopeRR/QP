from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
import io
import os

# Import the document generator
from IDLE import create_exam_paper

app = Flask(__name__, static_folder='dist')
CORS(app)  # Enable CORS for React frontend

@app.route('/api/generate-docx', methods=['POST'])
def generate_docx():
    """
    Generate a Word document from question data.
    
    Expected JSON body:
    {
        "department": "CSBS",
        "section": "A",
        "semester": "IV",
        "dateSession": "2025-02-27 (FN)",
        "courseCode": "CBB1222",
        "courseName": "Operating Systems",
        "ciaType": "CIA-I",
        "qpType": "QP-I",
        "partAQuestions": [
            {"qno": "1.", "question": "...", "co": "CO1", "btl": "BTL1", "marks": "2"},
            ...
        ],
        "partBQuestions": [
            {"qno": "7.a", "question": "...", "co": "CO1", "btl": "BTL2", "marks": "12"},
            {"qno": "", "question": "(OR)", "co": "", "btl": "", "marks": ""},
            {"qno": "7.b", "question": "...", "co": "CO1", "btl": "BTL3", "marks": "12"},
            ...
        ],
        "partCQuestions": [  // Only for QP-II
            {"qno": "9.a", "question": "...", "co": "CO1", "btl": "BTL4", "marks": "16"},
            {"qno": "", "question": "(OR)", "co": "", "btl": "", "marks": ""},
            {"qno": "9.b", "question": "...", "co": "CO2", "btl": "BTL5", "marks": "16"}
        ]
    }
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
    return jsonify({"status": "ok", "message": "Server is running"})


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve React static files"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    # Get port from environment variable (Railway) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    print("🚀 Starting Flask API server...")
    print(f"🌐 Port: {port}")
    print("📄 Document generation endpoint: POST /api/generate-docx")
    print("🏥 Health check endpoint: GET /api/health")
    print("=" * 50)
    
    # Disable debug mode in production (Railway sets PORT env var)
    debug_mode = os.environ.get('PORT') is None
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
