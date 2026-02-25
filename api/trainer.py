import pandas as pd
import json
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Paths
CSV_DATA_PATH = 'data/ucdp_conflict_data_ken.csv'
MODEL_PATH = 'api/risk_model.pkl'

def train_model():
    print("🧠 Starting AI Model Training on REAL-WORLD UCDP DATA...")
    
    if not os.path.exists(CSV_DATA_PATH):
        print(f"❌ Error: Dataset {CSV_DATA_PATH} not found.")
        return

    # 1. Load Real Data
    # Most HDX datasets have a HXL row at index 0
    df = pd.read_csv(CSV_DATA_PATH, low_memory=False)
    
    # If the first row contains HXL tags (starts with #), drop it
    if df.iloc[0].astype(str).str.startswith('#').any():
        print("🔍 Detected HXL tags, skipping metadata row...")
        df = df.drop(df.index[0])
    
    # Ensure numeric types for core features
    df['best'] = pd.to_numeric(df['best'], errors='coerce').fillna(0)
    df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce').fillna(0)
    df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce').fillna(0)
    
    # Filter for Kenya records
    df = df[df['country'] == 'Kenya']
    
    # 2. Preprocessing & Feature Engineering
    # Risk score based on fatalities
    df['risk_score'] = (df['best'] * 10) + 50 
    df['risk_score'] = df['risk_score'].clip(upper=100)
    
    # Extract timestamp features
    df['timestamp'] = pd.to_datetime(df['date_start'], errors='coerce')
    df = df.dropna(subset=['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    
    # Select Features
    X = df[['latitude', 'longitude', 'hour']]
    y = df['risk_score']
    
    # 3. Training Ensemble
    if len(X) < 10:
        print("❌ Error: Not enough data points after filtering.")
        return

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    print(f"📊 Training on {len(X_train)} records...")
    
    model = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
    model.fit(X_train, y_train)
    
    # 4. Persistence
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    # 5. Export samples for dashboard visualization
    samples = df.sort_values(by='risk_score', ascending=False).head(50)
    dashboard_data = []
    for _, row in samples.iterrows():
        dashboard_data.append({
            "type": "Conflict Incident",
            "sub_type": str(row['conflict_name']),
            "location": str(row['where_description']),
            "county": str(row['adm_1']),
            "coordinates": [float(row['latitude']), float(row['longitude'])],
            "fatalities": int(row['best']),
            "timestamp": str(row['date_start']),
            "source": "UCDP-GED-Official",
            "risk_score": int(row['risk_score'])
        })
    
    with open('data/verified_security_events_kenya.json', 'w') as f:
        json.dump(dashboard_data, f, indent=2)

    print(f"✅ Training Complete. Model saved to {MODEL_PATH}")
    print(f"📂 Updated dashboard samples in data/verified_security_events_kenya.json")

if __name__ == "__main__":
    train_model()
