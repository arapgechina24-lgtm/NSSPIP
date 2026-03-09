// Maps USALAMA APP citizen-reported incidents to NSSPIP's SecurityIncident type

import type { FCIRIncident } from './types';
import type { SecurityIncident } from '@/types';

/**
 * Map FCIR priority → NSSPIP threatLevel.
 */
function mapPriorityToThreatLevel(priority: string): SecurityIncident['threatLevel'] {
    const map: Record<string, SecurityIncident['threatLevel']> = {
        CRITICAL: 'CRITICAL',
        HIGH: 'HIGH',
        MEDIUM: 'MEDIUM',
        LOW: 'LOW',
    };
    return map[priority?.toUpperCase()] || 'MEDIUM';
}

/**
 * Map FCIR incident type → NSSPIP incident type.
 * Falls back to VIOLENT_CRIME for unrecognized types.
 */
function mapIncidentType(type: string): SecurityIncident['type'] {
    const validTypes: SecurityIncident['type'][] = [
        'TERRORISM', 'ORGANIZED_CRIME', 'CYBER_ATTACK', 'VIOLENT_CRIME',
        'TRAFFICKING', 'RADICALIZATION', 'BORDER_SECURITY', 'PUBLIC_DISORDER', 'CONFLICT',
    ];
    const upper = type?.toUpperCase().replace(/\s+/g, '_') || '';
    if (validTypes.includes(upper as SecurityIncident['type'])) {
        return upper as SecurityIncident['type'];
    }
    return 'VIOLENT_CRIME';
}

/**
 * Determine the NSSPIP region from coordinates (simple bounding-box approach).
 * Defaults to NAIROBI if coordinates are unavailable.
 */
function inferRegionFromCoords(
    lat: number | null,
    lng: number | null
): SecurityIncident['location']['region'] {
    if (lat === null || lng === null) return 'NAIROBI';

    // Simple bounding-box lookup for Kenyan cities
    if (lat > -1.5 && lat < -1.1 && lng > 36.6 && lng < 37.1) return 'NAIROBI';
    if (lat > -4.2 && lat < -3.8 && lng > 39.5 && lng < 39.8) return 'MOMBASA';
    if (lat > -0.2 && lat < 0.05 && lng > 34.6 && lng < 34.9) return 'KISUMU';
    if (lat > -0.5 && lat < -0.1 && lng > 35.9 && lng < 36.2) return 'NAKURU';
    if (lat > 0.3 && lat < 0.7 && lng > 35.1 && lng < 35.5) return 'ELDORET';
    if (lat > 2.5 && lat < 4.0 && lng > 34.5 && lng < 36.0) return 'TURKANA';
    if (lat > -0.7 && lat < -0.2 && lng > 39.4 && lng < 39.9) return 'GARISSA';
    if (lat > 3.5 && lat < 4.2 && lng > 41.5 && lng < 42.2) return 'MANDERA';

    return 'NAIROBI'; // Default fallback
}

/**
 * Map a single FCIR incident to the NSSPIP SecurityIncident format.
 */
export function mapFCIRToSecurityIncident(incident: FCIRIncident): SecurityIncident {
    const region = inferRegionFromCoords(incident.latitude, incident.longitude);

    return {
        id: `USALAMA-${incident.id}`,
        type: mapIncidentType(incident.type),
        title: incident.title || 'Citizen Report',
        description: incident.description || 'Incident reported via FCIR citizen app.',
        location: {
            name: incident.location || 'Unknown Location',
            region,
            coordinates: [
                incident.latitude || -1.2921,
                incident.longitude || 36.8219,
            ] as [number, number],
        },
        threatLevel: mapPriorityToThreatLevel(incident.priority),
        status: (incident.status?.toUpperCase() as SecurityIncident['status']) || 'ACTIVE',
        timestamp: new Date(incident.createdAt),
        affectedArea: 1,
        aiConfidence: 60, // Lower confidence for unverified citizen reports
        sources: ['USALAMA', 'Citizen Report'],
    };
}

/**
 * Map an array of FCIR incidents to SecurityIncident[].
 */
export function mapFCIRIncidents(incidents: FCIRIncident[]): SecurityIncident[] {
    return incidents.map(mapFCIRToSecurityIncident);
}
