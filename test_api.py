"""Test the generate-bank API endpoint with full response output"""
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

print('Testing /api/generate-bank...')
r = requests.post(url, json=data, timeout=180)
print(f'Status: {r.status_code}')

# Print raw response
raw = r.text
print(f'Raw response length: {len(raw)}')
print(f'First 2000 chars of raw response:')
print(raw[:2000])
print('---END---')
