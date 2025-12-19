from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import re
import string
from newspaper import Article

app = Flask(__name__)
CORS(app)  # Allow React to talk to this server

# --- PATH CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Ensure these filenames match what you saved in train_model.py
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'news_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'model', 'news_vectorizer.pkl')

# --- LOAD MODEL & VECTORIZER ---
try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Model and Vectorizer loaded successfully!")
except FileNotFoundError:
    print(" Error: Model files not found. Please run train_model.py first.")
    exit()

# --- CLEANING FUNCTION (MUST MATCH TRAINING EXACTLY) ---
# In backend/app.py

def wordopt(text):
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r"\\W", " ", text) 
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\n', '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    return text

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    print(f"Analyzing URL: {url}")

    try:
        # 1. Scrape the Article
        article = Article(url)
        article.download()
        article.parse()
        content = article.text
        
        if len(content) < 50:
             return jsonify({"error": "Could not extract enough text. The site might be blocking scrapers."}), 400

        # 2. Process Text
        cleaned_text = wordopt(content)
        vec_text = vectorizer.transform([cleaned_text])
        
        # 3. Predict
        prediction_val = model.predict(vec_text)[0]
        
        # Logic: 0 = Fake, 1 = True (Matched to your training script)
        result = "True News" if prediction_val == 1 else "Fake News"
        
        return jsonify({
            "prediction": result,
            "excerpt": content[:300] + "..."  # Send a snippet back to UI
        })

    except Exception as e:
        print(f" Error processing URL: {e}")
        return jsonify({"error": "Failed to process URL. Please try a different article."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)