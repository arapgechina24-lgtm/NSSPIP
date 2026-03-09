import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mapFCIRToSecurityIncident, mapFCIRIncidents } from '../lib/fcir/mapper'
import type { FCIRIncident, FCIRApiResponse } from '../lib/fcir/types'

// Mock fetch globally for client tests
global.fetch = vi.fn()

// ===== MAPPER TESTS =====

describe('FCIR Mapper', () => {
    const sampleIncident: FCIRIncident = {
        id: 'abc-123',
        type: 'VIOLENT_CRIME',
        title: 'Armed robbery near Westlands',
        description: 'Two armed suspects spotted near Westlands Mall',
        location: 'Westlands, Nairobi',
        latitude: -1.267,
        longitude: 36.808,
        status: 'ACTIVE',
        priority: 'HIGH',
        anonymous: true,
        createdAt: '2026-03-09T10:30:00Z',
    }

    it('should map a full FCIR incident to SecurityIncident', () => {
        const result = mapFCIRToSecurityIncident(sampleIncident)

        expect(result.id).toBe('USALAMA-abc-123')
        expect(result.type).toBe('VIOLENT_CRIME')
        expect(result.title).toBe('Armed robbery near Westlands')
        expect(result.description).toBe('Two armed suspects spotted near Westlands Mall')
        expect(result.location.name).toBe('Westlands, Nairobi')
        expect(result.location.region).toBe('NAIROBI')
        expect(result.location.coordinates).toEqual([-1.267, 36.808])
        expect(result.threatLevel).toBe('HIGH')
        expect(result.status).toBe('ACTIVE')
        expect(result.sources).toEqual(['USALAMA', 'Citizen Report'])
        expect(result.aiConfidence).toBe(60) // Lower for unverified citizen reports
        expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should default to NAIROBI region when coordinates are null', () => {
        const noCoords: FCIRIncident = {
            ...sampleIncident,
            latitude: null,
            longitude: null,
        }
        const result = mapFCIRToSecurityIncident(noCoords)

        expect(result.location.region).toBe('NAIROBI')
        expect(result.location.coordinates).toEqual([-1.2921, 36.8219])
    })

    it('should infer MOMBASA region from coordinates', () => {
        const mombasa: FCIRIncident = {
            ...sampleIncident,
            latitude: -4.04,
            longitude: 39.67,
        }
        const result = mapFCIRToSecurityIncident(mombasa)
        expect(result.location.region).toBe('MOMBASA')
    })

    it('should map unknown type to VIOLENT_CRIME', () => {
        const unknownType: FCIRIncident = {
            ...sampleIncident,
            type: 'UNKNOWN_CATEGORY',
        }
        const result = mapFCIRToSecurityIncident(unknownType)
        expect(result.type).toBe('VIOLENT_CRIME')
    })

    it('should map unknown priority to MEDIUM', () => {
        const unknownPriority: FCIRIncident = {
            ...sampleIncident,
            priority: 'URGENT',
        }
        const result = mapFCIRToSecurityIncident(unknownPriority)
        expect(result.threatLevel).toBe('MEDIUM')
    })

    it('should handle empty description and title gracefully', () => {
        const minimal: FCIRIncident = {
            ...sampleIncident,
            title: '',
            description: '',
        }
        const result = mapFCIRToSecurityIncident(minimal)
        expect(result.title).toBe('Citizen Report')
        expect(result.description).toBe('Incident reported via FCIR citizen app.')
    })

    it('should map an array of incidents', () => {
        const incidents: FCIRIncident[] = [sampleIncident, { ...sampleIncident, id: 'def-456' }]
        const results = mapFCIRIncidents(incidents)

        expect(results).toHaveLength(2)
        expect(results[0].id).toBe('USALAMA-abc-123')
        expect(results[1].id).toBe('USALAMA-def-456')
    })

    it('should return empty array for empty input', () => {
        const results = mapFCIRIncidents([])
        expect(results).toEqual([])
    })
})

// ===== CLIENT TESTS =====

describe('FCIR Client', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetModules()
    })

    it('should fetch incidents successfully', async () => {
        const mockResponse: FCIRApiResponse = {
            incidents: [{
                id: 'test-1',
                type: 'VIOLENT_CRIME',
                title: 'Test incident',
                description: 'A test',
                location: 'Nairobi',
                latitude: -1.29,
                longitude: 36.82,
                status: 'ACTIVE',
                priority: 'HIGH',
                anonymous: true,
                createdAt: '2026-03-09T10:00:00Z',
            }],
            total: 1,
        }

        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        })

        const { fetchFCIRIncidents } = await import('../lib/fcir/client')
        const result = await fetchFCIRIncidents()

        expect(result.incidents).toHaveLength(1)
        expect(result.total).toBe(1)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/incidents'),
            expect.objectContaining({ cache: 'no-store' })
        )
    })

    it('should return empty array on API error', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        })

        const { fetchFCIRIncidents } = await import('../lib/fcir/client')
        const result = await fetchFCIRIncidents()

        expect(result.incidents).toEqual([])
        expect(result.total).toBe(0)
    })

    it('should return empty array on network error', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

        const { fetchFCIRIncidents } = await import('../lib/fcir/client')
        const result = await fetchFCIRIncidents()

        expect(result.incidents).toEqual([])
        expect(result.total).toBe(0)
    })
})
