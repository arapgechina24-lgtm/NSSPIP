import { NextResponse } from 'next/server';
import { HealthSectorModule } from '@/lib/cross-sector/health-module';
import { AgricultureSectorModule } from '@/lib/cross-sector/agriculture-module';

export async function GET() {
  const health = new HealthSectorModule();
  const agriculture = new AgricultureSectorModule();

  const [healthAlerts, wildlifeAlerts, theftAlerts] = await Promise.all([
    health.detectOutbreak(),
    agriculture.predictWildlifeConflict(),
    agriculture.detectLivestockTheft(),
  ]);

  return NextResponse.json({
    security: {
      activeThreats: 12,
      resolvedToday: 8,
      responseTime: '8 minutes',
    },
    health: {
      activeAlerts: healthAlerts,
      potentialLivesSaved: 250,
      earlyWarningHours: 72,
    },
    agriculture: {
      wildlifeAlerts,
      theftAlerts,
      economicValueProtected: 'KES 45M',
      farmersProtected: 1200,
    },
    trade: {
      borderQueueOptimized: true,
      averageWaitTime: '12 minutes',
      smugglingDetections: 3,
    },
    overallImpact: {
      sectorsProtected: 4,
      economicValue: 'KES 2.3B annually',
      jobsProtected: 15000,
      crossSectorResilience: 'HIGH',
    },
  });
}
