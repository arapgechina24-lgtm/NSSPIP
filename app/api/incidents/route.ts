import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
                reporter: {
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

        if (!title || !description || !reportedBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Save Preliminary Incident to Database
        const incident = await prisma.incident.create({
            data: {
                title,
                description,
                location,
                latitude,
                longitude,
                reportedBy,
                priority: priority || "MEDIUM",
                status: "OPEN",
            },
        });

        // 2. Trigger AI Risk Scoring (Async)
        // We don't await this to keep the response snappy for the mobile app
        if (latitude && longitude) {
            fetch(`${AI_ENGINE_URL}/predict/risk-score`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude,
                    longitude,
                    time_of_day: new Date().getHours() > 18 || new Date().getHours() < 6 ? "night" : "day",
                }),
            })
                .then((res) => res.json())
                .then(async (aiResult) => {
                    // 3. Update Incident with AI Score and Results
                    // Note: In a production app, we might use a background job or WebSockets to push this to the UI
                    await prisma.incident.update({
                        where: { id: incident.id },
                        data: {
                            // We store the result in encryptedDetails or a new field if we chose to add it
                            // For now, let's prepend it to the description or store in encryptedDetails
                            encryptedDetails: JSON.stringify({
                                ai_score: aiResult.risk_score,
                                ai_level: aiResult.risk_level,
                                factors: aiResult.contributing_factors,
                            }),
                        },
                    });
                    console.log(`✅ AI Risk Scored for Incident ${incident.id}: ${aiResult.risk_score}`);
                })
                .catch((err) => console.error("AI Scoring Failed:", err));
        }

        return NextResponse.json(incident, { status: 201 });
    } catch (error) {
        console.error("Failed to create incident:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
