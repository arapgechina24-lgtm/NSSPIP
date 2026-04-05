// Incidents API: CRUD operations (with RBAC + rate limiting)
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createHash } from 'crypto'
import { requireAuth, requireRole } from '@/lib/rbac'


import { checkRateLimit, RATE_LIMITS, rateLimitHeaders } from '@/lib/rateLimit'
import { analyzeIncident } from '@/lib/ai'

// GET /api/incidents - List all incidents (authenticated, any role)
export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth();
        if (session instanceof NextResponse) return session;



        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const severity = searchParams.get('severity')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        const where: Record<string, unknown> = {}
        if (status) where.status = status
        if (severity) where.severity = severity

        const [incidents, total] = await Promise.all([
            prisma.incident.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                include: {
                    createdBy: {
                        select: { id: true, name: true, email: true, role: true }
                    },
                    threats: true,
                    responses: true,
                }
            }),
            prisma.incident.count({ where })
        ])

        return NextResponse.json({
            incidents,
            total,
            limit,
            offset,
        })

    } catch (error) {
        console.error('[API] Get incidents error:', error)
        return NextResponse.json({
            incidents: [],
            total: 0,
            limit: parseInt(request.nextUrl.searchParams.get('limit') || '50'),
            offset: parseInt(request.nextUrl.searchParams.get('offset') || '0'),
        })
    }
}

// POST /api/incidents - Create new incident (L2+ only, rate limited)
export async function POST(request: NextRequest) {
    try {
        const syncToken = request.headers.get('X-Sync-Token');
        const expectedToken = process.env.NCTIRS_SYNC_TOKEN;
        const isSyncRequest = !!(syncToken && expectedToken && syncToken === expectedToken);

        let session = null;
        if (!isSyncRequest) {
            try {
                session = await requireRole('L2');
                if (session instanceof NextResponse) return session;
            } catch (authError) {
                console.error('[API] Auth error:', authError);
                return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
            }

            // Rate limit for manual entries
            const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
            const rl = checkRateLimit(`incidents:${(session as any)?.user?.email || clientIP}`, RATE_LIMITS.STANDARD);
            if (!rl.allowed) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded' },
                    { status: 429, headers: rateLimitHeaders(rl.remaining, rl.resetAt) }
                );
            }
        }

        const data = await request.json();
        console.log('[API] Processing POST data:', JSON.stringify(data));
        const { title, description, type, severity, location, latitude, longitude, county } = data;

        if (!title || !type || !severity) {
            console.log('[API] Validation failed: missing title/type/severity', { title, type, severity });
            return NextResponse.json({ 
                error: 'VALIDATION_ERROR_V2', 
                message: 'Title, type, and severity are required for sync',
                received: { title, type, severity }
            }, { status: 400 });
        }

        const incident = await prisma.incident.create({
            data: {
                title,
                description: description || '',
                type,
                severity,
                status: 'ACTIVE',
                location,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                county,
                createdById: isSyncRequest ? null : (session?.user?.id || null),
            },
        });

        // Audit & AI as before...
        try {
            await prisma.auditLog.create({
                data: {
                    action: 'CREATE',
                    resource: 'incidents',
                    resourceId: incident.id,
                    userId: isSyncRequest ? null : (session?.user?.id || null),
                    details: JSON.stringify({ title, type, severity, isSync: isSyncRequest }),
                    hash: createHash('sha256').update(`CREATE-incident-${incident.id}-${Date.now()}`).digest('hex'),
                }
            });
        } catch (auditError) {
            console.error('[API] Audit logging failed:', auditError);
        }

        analyzeIncident({
            title: incident.title,
            type: incident.type,
            severity: incident.severity,
            description: incident.description,
            location: incident.location || undefined,
        }).then(async (aiResult) => {
            await prisma.incident.update({
                where: { id: incident.id },
                data: {
                    aiScore: Math.round(aiResult.riskAssessment.confidenceScore * 100),
                    aiFactors: JSON.stringify(aiResult.riskAssessment.justification),
                    forensicHash: createHash('sha256').update(JSON.stringify(aiResult)).digest('hex'),
                }
            });
        }).catch(err => console.error(`[AI] Analysis failed:`, err));

        return NextResponse.json({ success: true, incident }, { status: 201 });

    } catch (error) {
        console.error('[API] Fatal Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
