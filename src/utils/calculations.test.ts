import { describe, it, expect, setSystemTime, afterEach } from 'bun:test'
import {
  calculateData,
  formatCurrency,
  formatHours,
  PLANS,
} from './calculations'

describe('Utils', () => {
  describe('formatHours', () => {
    it('should format whole hours correctly', () => {
      expect(formatHours(5)).toBe('5h 0m')
    })

    it('should format fractional hours correctly', () => {
      expect(formatHours(1.5)).toBe('1h 30m')
      expect(formatHours(2.25)).toBe('2h 15m')
      expect(formatHours(0.1)).toBe('0h 6m')
    })
  })

  describe('formatCurrency', () => {
    it('should format numbers as USD currency', () => {
      expect(formatCurrency(10)).toBe('$10.00')
      expect(formatCurrency(19.99)).toBe('$19.99')
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('calculateData', () => {
    const mockBalance = { hours: 10, minutes: 30 }

    afterEach(() => {
        setSystemTime()
    })

    it('should calculate basic totals correctly', () => {
      const result = calculateData(
        'performance',
        'monthly',
        mockBalance,
        '',
        0,
        false
      )

      expect(result.totalCurrentHours).toBe(10.5)
      expect(result.planDetails).toEqual(PLANS.performance)
      expect(result.totalCost).toBe(PLANS.performance.monthlyPrice)
    })

    it('should handle rollover exclusion', () => {
       // 10.5 hours - 15 hours rollover = 0 effective (floored at 0)
      const result = calculateData(
        'performance',
        'monthly',
        mockBalance,
        '',
        0,
        true
      )
      expect(result.effectiveHours).toBe(0)

      // 20 hours - 15 hours = 5 effective
      const bigBalance = { hours: 20, minutes: 0 }
      const result2 = calculateData(
        'performance',
        'monthly',
        bigBalance,
        '',
        0,
        true
      )
      expect(result2.effectiveHours).toBe(5)
    })

    it('should calculate budget per day correctly', () => {
        // Mock current date to 2024-01-01
        const mockNow = new Date('2024-01-01T00:00:00')
        setSystemTime(mockNow)

        // Renewal in 10 days
        const renewalDate = '2024-01-11T00:00:00'

        const result = calculateData(
            'performance',
            'monthly',
            { hours: 100, minutes: 0 },
            renewalDate,
            0,
            false
        )

        expect(result.daysRemaining).toBe(10)
        expect(result.budgetPerDay).toBe(10) // 100 hours / 10 days
    })

    it('should calculate cost with top-ups', () => {
        const blocks = 2
        const result = calculateData(
            'performance',
            'monthly',
            mockBalance,
            '',
            blocks,
            false
        )
        const expectedCost = PLANS.performance.monthlyPrice + (blocks * PLANS.performance.topUpPrice)
        expect(result.totalCost).toBeCloseTo(expectedCost)
    })

    it('should calculate cost properly for yearly billing', () => {
        const result = calculateData(
            'performance',
            'yearly',
            mockBalance,
            '',
            0,
            false
        )
        expect(result.totalCost).toBe(PLANS.performance.yearlyPrice)
    })

    it('should default to performance plan if invalid plan provided', () => {
         const result = calculateData(
            'invalid-plan',
            'monthly',
            mockBalance,
            '',
            0,
            false
        )
        expect(result.planDetails).toEqual(PLANS.performance)
    })
  })
})
