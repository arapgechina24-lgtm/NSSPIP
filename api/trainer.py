import json
import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Paths
DATA_PATH = 'data/verified_security_events_kenya.json'
MODEL_PATH = 'api/risk_model.pkl'

def train_model():
    print("🧠 Initializing AI Model Training on Verified Data...")
    
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: Dataset {DATA_PATH} not found.")
        return

    # 1. Load Data
    with open(DATA_PATH, 'r') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    
    # 2. Feature Engineering
    # Flatten coordinates list into separate columns
    df['latitude'] = df['coordinates'].apply(lambda x: x[0])
    df['longitude'] = df['coordinates'].apply(lambda x: x[1])
    
    # Features: Latitude, Longitude, Hour of Day (from timestamp)
    df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
    
    X = df[['latitude', 'longitude', 'hour']]
    y = df['risk_score']
    
    # 3. Training
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 4. Save Model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"✅ Training Complete. Model saved to {MODEL_PATH}")
    print(f"📈 Model Score (R^2): {model.score(X_test, y_test):.2f}")

if __name__ == "__main__":
    train_model()
