import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.json();
    return NextResponse.json({ 
        message: "NCTIRS_DEBUG_ROUTE_ACTIVE",
        received: data,
        token: request.headers.get('X-Sync-Token'),
        env_token: process.env.NCTIRS_SYNC_TOKEN
    });
}
