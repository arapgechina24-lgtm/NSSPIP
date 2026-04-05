import time
import json
import random
from datetime import datetime

# Simulation parameters
AGENCY_IDS = ["NIS-INTEL", "GSU-SIGINT", "DCI-FORENSIC-HUB", "KDF-STRATCOMM"]
LOCATIONS = ["Nairobi CBD", "Mandera Border", "Mombasa Port", "Turkana West", "Garissa Corridor"]
EVENT_TYPES = ["RF_SURGE", "ENCRYPTED_HANDSHAKE", "AERIAL_PING", "ANOMALOUS_METADATA", "PERIMETER_PROBE"]

def generate_telemetry():
    return {
        "timestamp": datetime.now().strftime("%H:%M:%S.%f")[:-3],
        "agency": random.choice(AGENCY_IDS),
        "origin": random.choice(LOCATIONS),
        "type": random.choice(EVENT_TYPES),
        "strength": round(random.uniform(0.1, 0.99), 2),
        "forensic_hash": random.getrandbits(64)
    }

def start_simulation():
    print("🚀 [NCTIRS] TACTICAL SIGNAL SIMULATOR V1.0")
    print(">> INITIALIZING SECURE STREAM VIA Ke-CIRT MESH...")
    print(">> SOVEREIGN AI INFERENCE ENGINE LOADED.\n")
    
    try:
        while True:
            telemetry = generate_telemetry()
            msg = f"[{telemetry['timestamp']}] {telemetry['agency']} >> {telemetry['type']} AT {telemetry['origin'].upper()} (Signal: {telemetry['strength']}) | HASH: {hex(telemetry['forensic_hash'])}"
            
            # Simulate high-velocity tactical pings
            print(msg)
            
            # Random occasional "CRITICAL" warnings
            if random.random() > 0.95:
                print(f"\n⚠️  [CRITICAL_DETECTION] PROBABLE ASYMMETRIC THREAT IN {telemetry['origin'].upper()} | ADVISE NIS OVERRIDE\n")
            
            time.sleep(random.uniform(0.5, 2.0))
    except KeyboardInterrupt:
        print("\n>> TERMINATING SECURE STREAM. SYSTEM STANDBY.")

if __name__ == "__main__":
    start_simulation()
