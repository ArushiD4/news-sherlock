import re
from langdetect import detect

def preprocess_text(text):
    # DIRECTLY COPIED FROM YOUR FILE
    if not isinstance(text, str):
        return ''
    
    try:
        if detect(text) != 'en':
            return ''
    except:
        pass # Ignore language errors for short text
    
    # Same Cleaning Logic
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.lower()
    
    return text

def preprocess_article(db_collection, url):
    # Find the article we just fetched
    article = db_collection.find_one({"url": url})
    
    if article:
        clean_text = preprocess_text(article['text'])
        
        # Update DB (Like saving processed_comments.csv)
        db_collection.update_one(
            {"_id": article["_id"]},
            {"$set": {"clean_text": clean_text, "status": "pending_analysis"}}
        )
        return True
    return False