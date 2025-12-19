import pandas as pd
import numpy as np
import re
import string
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier

# --- PATH SETUP ---
# Defines paths relative to this script so it works on any machine
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODEL_DIR = os.path.join(BASE_DIR, 'model')

# Ensure model directory exists
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

# --- CLEANING FUNCTION (EXACT COPY FROM NOTEBOOK) ---
def wordopt(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text) 
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

def train():
    print("1. Loading datasets...")
    try:
        df_fake = pd.read_csv(os.path.join(DATA_DIR, "Fake.csv"))
        df_true = pd.read_csv(os.path.join(DATA_DIR, "True.csv"))
    except FileNotFoundError:
        print("❌ Error: 'Fake.csv' or 'True.csv' not found in 'backend/data/'")
        return

    # 2. Labeling (0 = Fake, 1 = True)
    df_fake["class"] = 0
    df_true["class"] = 1

    # 3. Merging & Shuffling
    print("2. Merging and processing data...")
    df_merge = pd.concat([df_fake, df_true], axis=0)
    df = df_merge.drop(["title", "subject", "date"], axis=1) # Drop unused columns
    df = df.sample(frac=1).reset_index(drop=True) # Shuffle

    # 4. Apply Cleaning
    df["text"] = df["text"].apply(wordopt)

    # 5. Split Data
    x = df["text"]
    y = df["class"]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25)

    # 6. Vectorization
    print("3. Vectorizing text (TF-IDF)...")
    vectorization = TfidfVectorizer()
    xv_train = vectorization.fit_transform(x_train)

    # 7. Train Model (Decision Tree)
    print("4. Training Decision Tree Model...")
    DT = DecisionTreeClassifier()
    DT.fit(xv_train, y_train)

    # 8. Save Model & Vectorizer
    print(f"5. Saving to {MODEL_DIR}...")
    joblib.dump(DT, os.path.join(MODEL_DIR, 'news_model.pkl'))
    joblib.dump(vectorization, os.path.join(MODEL_DIR, 'news_vectorizer.pkl'))

    # 9. Test Accuracy
    xv_test = vectorization.transform(x_test)
    score = DT.score(xv_test, y_test)
    print(f"✅ Success! Model trained with accuracy: {score*100:.2f}%")

if __name__ == "__main__":
    train()