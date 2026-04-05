import { NextRequest, NextResponse } from 'next/server';

// In-memory store for edge detections (production would use Redis/DB)
const recentDetections: EdgeDetection[] = [];
const MAX_STORED = 500;

interface EdgeDetection {
  id: string;
  deviceId: string;
  timestamp: string;
  detections: {
    class: string;
    confidence: number;
    bbox: { x1: number; y1: number; x2: number; y2: number };
    priority: string;
  }[];
  frameId: number;
  inferenceMs: number;
  model: string;
  receivedAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, timestamp, detections, frameId, inferenceMs, model } = body;

    if (!deviceId || !detections) {
      return NextResponse.json({ error: 'Missing deviceId or detections' }, { status: 400 });
    }

    const detection: EdgeDetection = {
      id: `det_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      deviceId,
      timestamp: timestamp || new Date().toISOString(),
      detections: detections || [],
      frameId: frameId || 0,
      inferenceMs: inferenceMs || 0,
      model: model || 'unknown',
      receivedAt: new Date().toISOString(),
    };

    recentDetections.push(detection);

    // Cap storage
    while (recentDetections.length > MAX_STORED) {
      recentDetections.shift();
    }

    // Check for high-priority detections
    const highPriority = (detections || []).filter(
      (d: { priority: string }) => d.priority === 'HIGH'
    );

    return NextResponse.json({
      status: 'received',
      detectionId: detection.id,
      highPriorityCount: highPriority.length,
      totalStored: recentDetections.length,
    });
  } catch (error) {
    console.error('[Edge] Detection ingest failed:', error);
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');
  const limit = parseInt(searchParams.get('limit') || '50');

  let filtered = recentDetections;
  if (deviceId) {
    filtered = filtered.filter(d => d.deviceId === deviceId);
  }

  const results = filtered.slice(-limit).reverse();

  // Compute stats
  const devices = new Set(recentDetections.map(d => d.deviceId));
  const totalDetections = recentDetections.reduce(
    (sum, d) => sum + d.detections.length, 0
  );
  const highPriorityTotal = recentDetections.reduce(
    (sum, d) => sum + d.detections.filter(det => det.priority === 'HIGH').length, 0
  );

  return NextResponse.json({
    system: 'NCTIRS Edge Detection Network',
    activeDevices: devices.size,
    deviceIds: Array.from(devices),
    totalFrames: recentDetections.length,
    totalDetections,
    highPriorityDetections: highPriorityTotal,
    recentDetections: results,
  });
}
