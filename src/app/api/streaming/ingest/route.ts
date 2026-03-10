import { NextRequest, NextResponse } from 'next/server';
import { eventStream, type StreamEvent } from '@/lib/streaming/event-stream';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, source, payload, priority } = body;

    if (!topic || !source || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, source, payload' },
        { status: 400 }
      );
    }

    const validTopics = ['incidents', 'threats', 'edge-telemetry', 'social-signals', 'cross-sector'];
    if (!validTopics.includes(topic)) {
      return NextResponse.json(
        { error: `Invalid topic. Valid: ${validTopics.join(', ')}` },
        { status: 400 }
      );
    }

    const event = await eventStream.ingestEvent({
      topic,
      source,
      timestamp: new Date().toISOString(),
      payload,
      priority: priority || 'MEDIUM',
    });

    return NextResponse.json({
      status: 'ingested',
      eventId: event.id,
      topic: event.topic,
      timestamp: event.timestamp,
    });
  } catch (error) {
    console.error('[Stream] Ingest failed:', error);
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 });
  }
}
