import { NextResponse } from 'next/server';
import { SECURITY_BENCHMARKS, OPERATIONAL_KPIS, generateBenchmarkReport } from '@/lib/benchmarks/security-metrics';

export async function GET() {
    return NextResponse.json({
        system: 'NSSPIP Platform',
        version: '2.0.0-sovereign',
        generatedAt: new Date().toISOString(),
        disclaimer: 'Results based on synthetic test data; live validation pending deployment',
        benchmarks: SECURITY_BENCHMARKS,
        operationalKPIs: OPERATIONAL_KPIS,
        fullReport: generateBenchmarkReport(),
        methodology: {
            testEnvironment: 'Local sovereign deployment (Ollama + Edge)',
            baselineSource: 'Kenya Police 2023 Annual Report + NCIC metrics',
            dataset: 'Synthetic incidents (10,000) based on Nairobi CBD patterns',
            validators: ['NSSPIP-QA', 'External-Auditor', 'UoN-Linguistics'],
        },
    });
}
