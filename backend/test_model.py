import joblib
import re
import string
import os

# --- PATH SETUP ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'news_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'model', 'news_vectorizer.pkl')

def wordopt(text):
    # MUST match training cleaning exactly
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text) 
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

def manual_testing(news):
    try:
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
    except FileNotFoundError:
        return "Error: Model files not found. Please run train_model.py first."

    # Process input
    clean_text = wordopt(news)
    vec_text = vectorizer.transform([clean_text])
    
    # Predict using Decision Tree
    prediction = model.predict(vec_text)

    # Return Result (0 = Fake, 1 = True)
    return "True News" if prediction[0] == 1 else "Fake News"

if __name__ == "__main__":
    print(f"Loading model from: {MODEL_PATH}")
    print("\n--- TEST MODE ---")
    print("Paste a news article below to check if it's Fake or True.")
    print("Type 'exit' to quit.\n")

    while True:
        news = input("Paste news text: ")
        if news.lower() == 'exit':
            break
        if news.strip():
            result = manual_testing(news)
            # Print result in color (Green for True, Red for Fake) if supported, else plain text
            if result == "True News":
                print(f"Prediction: \033[92m{result}\033[0m") 
            else:
                print(f"Prediction: \033[91m{result}\033[0m")
        print("-" * 30)