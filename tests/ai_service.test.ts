import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRiskScore, analyzeSurveillance, RiskResponse, SurveillanceResponse } from '../lib/api/ai-service'

global.fetch = vi.fn()

describe('AI Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetchRiskScore should return risk data on success', async () => {
        const mockResponse: RiskResponse = {
            risk_score: 75,
            risk_level: 'HIGH',
            contributing_factors: ['Factor 1']
        }
            ; (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse
            })

        const result = await fetchRiskScore(-1.28, 36.82)
        expect(result).toEqual(mockResponse)
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/predict/risk-score'), expect.any(Object))
    })

    it('analyzeSurveillance should return detection data on success', async () => {
        const mockResponse: SurveillanceResponse = {
            feed_id: 'cam-1',
            timestamp: '2024-01-01T00:00:00Z',
            detected_objects: [{ label: 'person', confidence: 0.9, bbox: [0, 0, 10, 10] }],
            alert_triggered: false
        }
            ; (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse
            })

        const result = await analyzeSurveillance('cam-1')
        expect(result).toEqual(mockResponse)
    })

    it('should return null on fetch error', async () => {
        ; (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))
        const result = await fetchRiskScore(-1.28, 36.82)
        expect(result).toBeNull()
    })
})
