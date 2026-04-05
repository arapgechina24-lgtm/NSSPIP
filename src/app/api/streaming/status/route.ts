import { NextResponse } from 'next/server';
import { eventStream } from '@/lib/streaming/event-stream';

export async function GET() {
  const status = eventStream.getStatus();

  return NextResponse.json({
    system: 'NCTIRS Event Stream',
    ...status,
    kafka: {
      configured: !!process.env.KAFKA_BROKERS,
      brokers: process.env.KAFKA_BROKERS || 'Not configured (using in-memory fallback)',
      note: 'Production deployment uses Apache Kafka on sovereign network',
    },
  });
}
