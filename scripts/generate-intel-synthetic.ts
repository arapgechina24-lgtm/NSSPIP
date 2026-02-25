/**
 * NSSPIP Intelligence Synthesizer
 * Generates "Confidential" grade intelligence reports mimicking NIS and National Police sources.
 * This satisfies the Phase 1 deliverable for "Synthesized dummy data mimicking confidential sources".
 */

import { PrismaClient } from "@prisma/client"
import { createHash } from "crypto"

const prisma = new PrismaClient()

const NIS_REPORTS = [
    { title: "SIGINT: Anomaly in Kibera Communication Hubs", content: "Signal analysis indicates a 300% spike in encrypted packet relaying between Sector 4 and 9. Probable preparation for localized coordination.", level: "SECRET" },
    { title: "HUMINT: Verification of Suspect Transit in CBD", content: "Human intelligence confirms a high-value suspect associated with organized trafficking was spotted at Nairobi Railway Station. Surveillance advised.", level: "TOP_SECRET" },
    { title: "OSINT: Coordinated Social Media Sentiment Shift", content: "Automated scraping identifies a cross-platform narrative shift targeting critical energy infrastructure in the Rift Valley.", level: "CONFIDENTIAL" },
    { title: "TACTICAL: CNI Vulnerability Assessment - Lake Turkana", content: "Physical security audit identifies blind spots in the northern perimeter of the Turkana-Nairobi transmission line.", level: "SECRET" }
]

const POLICE_REPORTS = [
    { title: "FIELD: Armed Robbery Trend - Westlands Sector", content: "Significant increase in evening carjackings using 'fake roadblock' tactics reported by patrol units.", level: "UNCLASSIFIED" },
    { title: "DISPATCH: Suspected Narcotics Warehouse - Industrial Area", content: "Multiple civilian reports of unusual late-night heavy vehicle movements at Warehouse 42-B.", level: "CONFIDENTIAL" },
    { title: "OPERATIONAL: Crowd Control Readiness - Central District", content: "Stockpile of non-lethal deterrents verified at Central Police Station ahead of scheduled demonstrations.", level: "CONFIDENTIAL" }
]

async function generateSovereignIntel() {
    console.log("🚀 Initializing Sovereign Intelligence Synthesis...")

    // Get an existing user to act as author (Commander/Analyst)
    const user = await prisma.user.findFirst({
        where: { role: { in: ["COMMANDER", "ANALYST"] } }
    })

    if (!user) {
        console.error("❌ No authorized user found to author intelligence. Please seed users first.")
        return
    }

    const allReports = [...NIS_REPORTS, ...POLICE_REPORTS]

    for (const report of allReports) {
        // Generate Forensic ID for the intelligence
        const hash = createHash("sha256")
            .update(`${new Date().toISOString()}|${report.title}|${report.content}`)
            .digest("hex")

        try {
            await prisma.intelligence.create({
                data: {
                    title: report.title,
                    content: report.content,
                    source: report.title.startsWith("SIGINT") || report.title.startsWith("HUMINT") ? "NIS" : "NPS",
                    classification: report.level as any,
                    createdBy: user.id,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 day retention
                }
            })
            console.log(`✅ Synthesized Intel: ${report.title} [FORENSIC-ID: ${hash.substring(0, 8)}]`)
        } catch (e) {
            console.error(`Failed to synthesize ${report.title}:`, e)
        }
    }

    console.log("🏁 Intelligence Synthesis Complete.")
}

generateSovereignIntel()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
