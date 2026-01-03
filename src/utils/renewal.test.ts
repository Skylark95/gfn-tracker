import { describe, it, expect } from 'vitest'
import { checkRenewal } from './renewal'
import { Balance } from '../types'

describe('checkRenewal', () => {
  const baseDate = new Date('2023-01-15T12:00:00')
  const pastDate = '2023-01-01T00:00:00' // Passed
  const futureDate = '2023-02-01T00:00:00' // Future

  const baseBalance: Balance = { hours: 50, minutes: 30 }

  // Mock Date.now to be stable
  const mockNow = new Date('2023-01-15T12:00:00').getTime()

  const defaultOptions = {
    now: mockNow,
    renewalDate: pastDate,
    autoRenew: true,
    resetBalanceOnRenewal: true,
    includeRollover: true,
    clearTopUpsOnRenewal: true,
    balance: baseBalance,
    purchasedBlocks: 5,
  }

  it('should not renew if autoRenew is false', () => {
    const result = checkRenewal({ ...defaultOptions, autoRenew: false })
    expect(result.didRenew).toBe(false)
  })

  it('should not renew if renewalDate is in the future', () => {
    const result = checkRenewal({ ...defaultOptions, renewalDate: futureDate })
    expect(result.didRenew).toBe(false)
  })

  it('should renew if autoRenew is true and date is in the past', () => {
    const result = checkRenewal(defaultOptions)
    expect(result.didRenew).toBe(true)
    // Should advance 1 month from Jan 1 to Feb 1
    expect(result.newRenewalDate).toContain('2023-02-01')
  })

  it('should reset balance to 100h if resetBalanceOnRenewal is true', () => {
    const result = checkRenewal(defaultOptions)
    // 50.5 hours remaining. Rollover enabled.
    // Rollover = min(50.5, 15) = 15.
    // New Balance = 100 + 15 = 115.
    expect(result.newBalance).toEqual({ hours: 115, minutes: 0 })
  })

  it('should exclude rollover if includeRollover is false', () => {
    const result = checkRenewal({ ...defaultOptions, includeRollover: false })
    // New Balance = 100 + 0 = 100.
    expect(result.newBalance).toEqual({ hours: 100, minutes: 0 })
  })

  it('should not reset balance if resetBalanceOnRenewal is false', () => {
    const result = checkRenewal({ ...defaultOptions, resetBalanceOnRenewal: false })
    // Balance should remain unchanged
    expect(result.newBalance).toEqual(baseBalance)
  })

  it('should clear top-ups if clearTopUpsOnRenewal is true', () => {
    const result = checkRenewal(defaultOptions)
    expect(result.newPurchasedBlocks).toBe(0)
  })

  it('should not clear top-ups if clearTopUpsOnRenewal is false', () => {
    const result = checkRenewal({ ...defaultOptions, clearTopUpsOnRenewal: false })
    expect(result.newPurchasedBlocks).toBe(5)
  })

  it('should calculate rollover correctly (under cap)', () => {
    const lowBalance = { hours: 10, minutes: 0 }
    const result = checkRenewal({ ...defaultOptions, balance: lowBalance })
    // Rollover = 10. New = 100 + 10 = 110.
    expect(result.newBalance).toEqual({ hours: 110, minutes: 0 })
  })

  it('should calculate rollover correctly (over cap)', () => {
    const highBalance = { hours: 20, minutes: 0 }
    const result = checkRenewal({ ...defaultOptions, balance: highBalance })
    // Rollover = 15. New = 100 + 15 = 115.
    expect(result.newBalance).toEqual({ hours: 115, minutes: 0 })
  })

  it('should handle invalid renewal date gracefully', () => {
     const result = checkRenewal({ ...defaultOptions, renewalDate: '' })
     expect(result.didRenew).toBe(false)
  })
})
