"""Verify API response format matches expected types"""
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv('.env.local')

url = 'http://localhost:5000/api/generate-bank'
data = {
    'cdap': 'Course: CS201 - OOP\nCO1: Understand OOP (BTL2)\nCO2: Apply OOP concepts (BTL3)',
    'syllabus': 'Unit I: Classes, Objects\nUnit II: Inheritance, Polymorphism',
    'template': 'Part A: 6x2=12, Part B: 4x12=48',
    'facultySelection': {'ciaType': 'CIA-I', 'qpType': 'QP-I', 'courseCode': 'CS201', 'courseTitle': 'OOP'}
}

print('Testing API format...')
r = requests.post(url, json=data, timeout=180)
print(f'Status: {r.status_code}')

if r.status_code == 200:
    resp = r.json()
    
    if 'questions' in resp and isinstance(resp['questions'], list):
        questions = resp['questions']
        print(f'✅ Questions is a list with {len(questions)} items')
        
        # Check first question format
        if len(questions) > 0:
            q = questions[0]
            expected_fields = ['id', 'text', 'marks', 'unit', 'co', 'btl', 'difficulty', 'type']
            optional_fields = ['topic', 'subtopic', 'hasDiagram', 'diagramType', 'diagramDescription']
            
            print('\n📋 First question fields:')
            for field in expected_fields + optional_fields:
                if field in q:
                    val = str(q[field])[:50] + '...' if len(str(q[field])) > 50 else q[field]
                    print(f'  ✅ {field}: {val}')
                else:
                    print(f'  ❌ MISSING: {field}')
            
            print('\n📊 Sample question:')
            print(json.dumps(q, indent=2)[:800])
    else:
        print(f'❌ Questions format issue: {resp}')
else:
    print(f'❌ Error: {r.text[:500]}')
