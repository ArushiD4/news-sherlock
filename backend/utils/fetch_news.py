from newspaper import Article

def fetch_and_save(url, db_collection):
    print(f"[INFO] Fetching metadata for URL: {url}")
    try:
        # 1. Extract Data (Like extract_video_id)
        article = Article(url)
        article.download()
        article.parse()
        
        # 2. Check for duplicates (Like getting existing comments)
        if db_collection.find_one({"url": url}):
            print("[INFO] Article already exists.")
            return True

        # 3. Structure Data (Like your 'metadata' dictionary)
        data = {
            "title": article.title,
            "text": article.text,
            "url": url,
            "top_image": article.top_image,
            "status": "pending_preprocessing" # Next step
        }
        
        db_collection.insert_one(data)
        print(f"[SUCCESS] Fetched: {article.title}")
        return True
    except Exception as e:
        print(f"[ERROR] Fetch failed: {e}")
        return False