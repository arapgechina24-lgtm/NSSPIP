// USALAMA APP Sync API Route — proxies citizen-reported incidents from the USALAMA platform

import { NextResponse } from 'next/server';
import { fetchFCIRIncidents } from '@/lib/fcir/client';

export async function GET() {
    try {
        const data = await fetchFCIRIncidents();

        return NextResponse.json({
            incidents: data.incidents,
            total: data.total,
            source: 'USALAMA',
            syncedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('FCIR sync failed:', error);
        return NextResponse.json(
            { incidents: [], total: 0, source: 'USALAMA', error: 'Sync failed' },
            { status: 502 }
        );
    }
}
