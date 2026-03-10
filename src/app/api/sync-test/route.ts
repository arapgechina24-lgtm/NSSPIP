import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.json();
    return NextResponse.json({ 
        message: "NSSPIP_DEBUG_ROUTE_ACTIVE",
        received: data,
        token: request.headers.get('X-Sync-Token'),
        env_token: process.env.NSSPIP_SYNC_TOKEN
    });
}
