"""
Quick test script to verify Gemini API key is working properly.
"""
import os
import requests

# Load environment
try:
    from dotenv import load_dotenv
    if os.path.exists('.env.local'):
        load_dotenv('.env.local')
        print("📄 Loaded .env.local")
except ImportError:
    print("⚠️ python-dotenv not installed")

def test_gemini_api():
    """Test the Gemini API connection."""
    api_key = os.environ.get('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment!")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...{api_key[-5:]}")
    
    # Test with gemini-2.5-flash model
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    payload = {
        'contents': [{
            'parts': [{'text': 'Say "Hello! Gemini API is working!" in exactly those words.'}]
        }],
        'generationConfig': {
            'temperature': 0.1,
            'maxOutputTokens': 50,
        }
    }
    
    print("\n🔄 Testing Gemini API...")
    print(f"   Model: gemini-2.5-flash")
    print(f"   URL: {url[:60]}...")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"\n📡 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'candidates' in data and len(data['candidates']) > 0:
                candidate = data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    text = candidate['content']['parts'][0].get('text', '')
                    print(f"\n✅ SUCCESS! Gemini responded:")
                    print(f"   \"{text}\"")
                    return True
            print("⚠️ Unexpected response format:")
            print(data)
            return False
        else:
            print(f"\n❌ API Error!")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:500]}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out!")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("       GEMINI API KEY TEST")
    print("=" * 50)
    
    success = test_gemini_api()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Gemini API is working properly!")
    else:
        print("⚠️ Gemini API test failed. Check the errors above.")
    print("=" * 50)
