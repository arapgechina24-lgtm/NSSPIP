// FCIR API Client — fetches citizen-reported incidents from the FCIR platform

import type { FCIRApiResponse } from './types';

// Configurable via environment variable, defaults to production FCIR URL
const FCIR_API_URL =
    process.env.NEXT_PUBLIC_FCIR_API_URL || 'https://fcir-interface.vercel.app';

/**
 * Fetch all incidents from the FCIR citizen reporting platform.
 * Returns an empty array on failure (non-blocking for the dashboard).
 */
export async function fetchFCIRIncidents(): Promise<FCIRApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10s timeout

    try {
        const response = await fetch(`${FCIR_API_URL}/api/incidents`, {
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            console.warn(`FCIR API returned ${response.status}: ${response.statusText}`);
            return { incidents: [], total: 0 };
        }

        const data: FCIRApiResponse = await response.json();
        return data;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            console.warn('FCIR API request timed out after 10s');
        } else {
            console.warn('Failed to fetch FCIR incidents:', error);
        }
        return { incidents: [], total: 0 };
    } finally {
        clearTimeout(timeoutId);
    }
}
