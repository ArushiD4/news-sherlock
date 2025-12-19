import joblib
import os

def analyze_article(db_collection, url):
    # 1. Load Resources (Same as before)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model = joblib.load(os.path.join(base_dir, "model", "news_model.pkl"))
    vectorizer = joblib.load(os.path.join(base_dir, "model", "news_vectorizer.pkl"))
    
    # 2. Get Data
    article = db_collection.find_one({"url": url})
    
    if article and 'clean_text' in article:
        # 3. Predict (Same logic)
        vec_text = vectorizer.transform([article['clean_text']])
        prediction = model.predict(vec_text)[0] # "REAL" or "FAKE"
        confidence = model.decision_function(vec_text)[0] # Get score
        
        # 4. Save Result
        db_collection.update_one(
            {"_id": article["_id"]},
            {"$set": {
                "status": "complete",
                "prediction": prediction,
                "confidence": float(confidence)
            }}
        )
        return {"prediction": prediction, "confidence": float(confidence)}
    return None