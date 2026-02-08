"""Quick format check"""
import requests
r = requests.post('http://localhost:5000/api/generate-bank', 
    json={
        'cdap': 'CO1: OOP', 
        'syllabus': 'Unit I: Classes', 
        'template': '6x2', 
        'facultySelection': {'ciaType': 'CIA-I', 'qpType': 'QP-I', 'courseCode': 'CS201', 'courseTitle': 'OOP'}
    }, 
    timeout=120)
data = r.json()
qs = data.get('questions', [])
print(f'Count: {len(qs)}')
print(f'Type: {type(qs)}')
if qs:
    print(f'Fields: {list(qs[0].keys())}')
    print(f'Sample: unit={qs[0].get("unit")}, marks={qs[0].get("marks")}, co={qs[0].get("co")}')
else:
    print('No questions returned')
    print(f'Response: {data}')
