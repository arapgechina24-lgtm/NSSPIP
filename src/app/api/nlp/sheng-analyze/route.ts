import { NextRequest, NextResponse } from 'next/server';
import { shengEngine } from '@/lib/ai/sheng-nlp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mode } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "text" field' }, { status: 400 });
    }

    if (mode === 'quick') {
      // Fast scan for streaming / real-time use
      const result = shengEngine.quickScan(text);
      return NextResponse.json({ mode: 'quick', ...result });
    }

    // Full analysis
    const result = await shengEngine.analyzeText(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Sheng NLP] Analysis failed:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

export async function GET() {
  // Return lexicon stats
  return NextResponse.json({
    engine: 'NSSPIP Sheng NLP',
    version: '1.0.0',
    ...shengEngine.getStats(),
  });
}
