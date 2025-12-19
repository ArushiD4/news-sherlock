import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_db():
    # Looks for MONGO_URI in .env
    client = MongoClient(os.getenv("MONGO_URI"))
    return client["news_sherlock_db"]