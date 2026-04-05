#!/usr/bin/env python3
"""
NCTIRS Edge Detector — YOLOv8 Computer Vision for Raspberry Pi / Edge Devices
Detects objects of interest and reports to the NCTIRS sovereign dashboard.

Usage:
    python edge_detector.py --server http://localhost:3000 --confidence 0.5
    python edge_detector.py --camera 0 --interval 2 --server http://nctirs-core:3000
"""

import argparse
import json
import time
import uuid
import sys
from datetime import datetime

try:
    from ultralytics import YOLO
    import cv2
    import requests
    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False

# Classes of security interest (COCO dataset indices)
SECURITY_CLASSES = {
    0: 'person',
    1: 'bicycle',
    2: 'car',
    3: 'motorcycle',
    5: 'bus',
    7: 'truck',
    24: 'backpack',
    25: 'umbrella',
    26: 'handbag',
    27: 'tie',
    28: 'suitcase',
    39: 'bottle',
    41: 'cup',
    42: 'fork',
    43: 'knife',
    44: 'spoon',
    63: 'laptop',
    64: 'mouse',
    66: 'keyboard',
    67: 'cell phone',
}

# High-priority detections that trigger immediate alerts
HIGH_PRIORITY_CLASSES = {'knife', 'backpack', 'suitcase'}

class EdgeDetector:
    def __init__(self, model_path='yolov8n.pt', confidence=0.5, server_url='http://localhost:3000'):
        self.model_path = model_path
        self.confidence = confidence
        self.server_url = server_url
        self.device_id = f"edge-{uuid.uuid4().hex[:8]}"
        self.detection_count = 0
        self.start_time = time.time()

        if HAS_DEPS:
            print(f"[NCTIRS Edge] Loading YOLOv8 model: {model_path}")
            self.model = YOLO(model_path)
            print(f"[NCTIRS Edge] Model loaded. Device ID: {self.device_id}")
        else:
            print("[NCTIRS Edge] Running in DEMO mode (no ultralytics/cv2)")
            self.model = None

    def detect_frame(self, frame):
        """Run YOLOv8 inference on a single frame."""
        if self.model is None:
            return self._generate_demo_detections()

        results = self.model(frame, conf=self.confidence, verbose=False)
        detections = []

        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    cls_id = int(box.cls[0])
                    cls_name = SECURITY_CLASSES.get(cls_id)
                    if cls_name:
                        conf = float(box.conf[0])
                        x1, y1, x2, y2 = [float(c) for c in box.xyxy[0]]
                        detections.append({
                            'class': cls_name,
                            'confidence': round(conf, 3),
                            'bbox': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2},
                            'priority': 'HIGH' if cls_name in HIGH_PRIORITY_CLASSES else 'MEDIUM',
                        })

        return detections

    def _generate_demo_detections(self):
        """Generate realistic mock detections for demo mode."""
        import random
        demo_classes = ['person', 'car', 'backpack', 'cell phone', 'truck']
        count = random.randint(1, 4)
        detections = []
        for _ in range(count):
            cls = random.choice(demo_classes)
            detections.append({
                'class': cls,
                'confidence': round(random.uniform(0.5, 0.95), 3),
                'bbox': {
                    'x1': random.uniform(0, 400),
                    'y1': random.uniform(0, 300),
                    'x2': random.uniform(400, 800),
                    'y2': random.uniform(300, 600),
                },
                'priority': 'HIGH' if cls in HIGH_PRIORITY_CLASSES else 'MEDIUM',
            })
        return detections

    def report_to_server(self, detections):
        """Send detection payload to NCTIRS dashboard."""
        payload = {
            'topic': 'edge-telemetry',
            'source': self.device_id,
            'priority': 'HIGH' if any(d['priority'] == 'HIGH' for d in detections) else 'MEDIUM',
            'payload': {
                'deviceId': self.device_id,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'detections': detections,
                'frameId': self.detection_count,
                'inferenceMs': 280,  # Approximate for Pi 4
                'model': self.model_path,
            },
        }

        try:
            # Use streaming ingest endpoint
            resp = requests.post(
                f"{self.server_url}/api/streaming/ingest",
                json=payload,
                timeout=5,
            )
            if resp.status_code == 200:
                data = resp.json()
                print(f"  ✅ Reported to NCTIRS: {data.get('eventId', 'ok')}")
            else:
                print(f"  ⚠️  Server responded: {resp.status_code}")
        except requests.ConnectionError:
            print(f"  ❌ Cannot reach NCTIRS at {self.server_url} (offline mode)")
        except Exception as e:
            print(f"  ❌ Report failed: {e}")

        # Also report to dedicated edge endpoint
        try:
            resp2 = requests.post(
                f"{self.server_url}/api/edge/detections",
                json=payload['payload'],
                timeout=5,
            )
            if resp2.status_code == 200:
                print(f"  ✅ Edge endpoint acknowledged")
        except Exception:
            pass

    def run(self, camera_id=0, interval=2):
        """Main detection loop."""
        print(f"\n🇰🇪 NCTIRS Edge Detector v1.0")
        print(f"   Device: {self.device_id}")
        print(f"   Server: {self.server_url}")
        print(f"   Model:  {self.model_path}")
        print(f"   Conf:   {self.confidence}")
        print(f"   Interval: {interval}s")
        print(f"   {'='*40}\n")

        if not HAS_DEPS:
            print("[DEMO MODE] Generating synthetic detections...\n")
            while True:
                self.detection_count += 1
                detections = self._generate_demo_detections()
                print(f"[Frame {self.detection_count}] Detected {len(detections)} objects:")
                for d in detections:
                    print(f"  • {d['class']} ({d['confidence']:.0%}) [{d['priority']}]")
                self.report_to_server(detections)
                print()
                time.sleep(interval)
            return

        cap = cv2.VideoCapture(camera_id)
        if not cap.isOpened():
            print(f"❌ Cannot open camera {camera_id}")
            sys.exit(1)

        print(f"📹 Camera {camera_id} opened. Press Ctrl+C to stop.\n")

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("⚠️  Frame read failed, retrying...")
                    time.sleep(1)
                    continue

                self.detection_count += 1
                detections = self.detect_frame(frame)

                if detections:
                    print(f"[Frame {self.detection_count}] Detected {len(detections)} objects:")
                    for d in detections:
                        marker = '🔴' if d['priority'] == 'HIGH' else '🟡'
                        print(f"  {marker} {d['class']} ({d['confidence']:.0%})")
                    self.report_to_server(detections)

                time.sleep(interval)

        except KeyboardInterrupt:
            print("\n\n🛑 Edge detector stopped.")
            elapsed = time.time() - self.start_time
            print(f"   Frames processed: {self.detection_count}")
            print(f"   Runtime: {elapsed:.0f}s")
        finally:
            cap.release()


def main():
    parser = argparse.ArgumentParser(description='NCTIRS Edge Detector — YOLOv8')
    parser.add_argument('--camera', type=int, default=0, help='Camera device ID')
    parser.add_argument('--model', type=str, default='yolov8n.pt', help='YOLOv8 model path')
    parser.add_argument('--confidence', type=float, default=0.5, help='Detection confidence threshold')
    parser.add_argument('--interval', type=float, default=2, help='Seconds between frames')
    parser.add_argument('--server', type=str, default='http://localhost:3000', help='NCTIRS server URL')
    args = parser.parse_args()

    detector = EdgeDetector(
        model_path=args.model,
        confidence=args.confidence,
        server_url=args.server,
    )
    detector.run(camera_id=args.camera, interval=args.interval)


if __name__ == '__main__':
    main()
