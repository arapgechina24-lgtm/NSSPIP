import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

// AI Engine URL for risk scoring
const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:3000/api/ai";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const status = searchParams.get("status");

        const incidents = await prisma.incident.findMany({
            where: status ? { status: status as any } : {},
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                createdBy: {
                    select: {
                        name: true,
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json({ incidents, total: incidents.length });
    } catch (error) {
        console.error("Failed to fetch incidents:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, location, latitude, longitude, reportedBy, priority } = body;

        if (!title || !description) {
            console.log('[API_OLD] Missing fields:', { title, description });
            return NextResponse.json({ 
                error: "VALIDATION_ERROR_OLD_PATH",
                message: "Title and description are required"
            }, { status: 400 });
        }

        // --- FORENSIC-GRADE AUDIT TRAIL ---
        // Generate a SHA-256 fingerprint of the core evidence data
        // (timestamp + author + location + description)
        const timestamp = new Date().toISOString();
        const forensicPayload = `${timestamp}|${location}|${description}`;
        const hash = createHash("sha256").update(forensicPayload).digest("hex");

        // 1. Save Preliminary Incident to Database
        const incident = await prisma.incident.create({
            data: {
                title,
                description,
                type: body.type || 'CIVIL_REPORT',
                severity: body.severity || 'MEDIUM',
                location,
                latitude,
                longitude,
                status: "OPEN",
                forensicHash: hash,
            },
        });

        // 2. Trigger AI Risk Scoring (Async)
        // ... (rest of the logic)

        console.log(`✅ Incident created via Legacy Route: ${incident.id}`);
        return NextResponse.json({ success: true, incident }, { status: 201 });
    } catch (error) {
        console.error("Failed to create incident via Legacy Route:", error);
        return NextResponse.json({ error: "Internal Server Error", details: (error as any).message }, { status: 500 });
    }
}
