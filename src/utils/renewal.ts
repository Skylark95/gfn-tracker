import { Balance } from '../types'
import { ROLLOVER_HOURS } from './calculations'
import { addMonths, format, isValid } from 'date-fns'

export interface RenewalOptions {
  now?: number // timestamp
  renewalDate: string
  autoRenew: boolean
  resetBalanceOnRenewal: boolean
  includeRollover: boolean
  clearTopUpsOnRenewal: boolean
  balance: Balance
  purchasedBlocks: number
}

export interface RenewalResult {
  didRenew: boolean
  newRenewalDate?: string
  newBalance?: Balance
  newPurchasedBlocks?: number
}

export const checkRenewal = (options: RenewalOptions): RenewalResult => {
  const {
    now = Date.now(),
    renewalDate,
    autoRenew,
    resetBalanceOnRenewal,
    includeRollover,
    clearTopUpsOnRenewal,
    balance,
    purchasedBlocks,
  } = options

  if (!autoRenew || !renewalDate) {
    return { didRenew: false }
  }

  // Use parseISO for more robust string parsing if valid ISO, or new Date fallback
  const currentRenewal = new Date(renewalDate)

  if (!isValid(currentRenewal)) {
    return { didRenew: false }
  }

  if (currentRenewal.getTime() > now) {
    return { didRenew: false }
  }

  // Perform Renewal

  // 1. Advance Date 1 Month using date-fns
  const newDate = addMonths(currentRenewal, 1)

  // Format to string compatible with input type="datetime-local" (YYYY-MM-DDTHH:mm)
  const formattedDate = format(newDate, "yyyy-MM-dd'T'HH:mm")

  // 2. Reset Balance Logic
  let newBalance = { ...balance }

  if (resetBalanceOnRenewal) {
    let rollover = 0
    if (includeRollover) {
      const currentHours = balance.hours + balance.minutes / 60
      rollover = Math.min(currentHours, ROLLOVER_HOURS)
    }

    const totalNewHours = 100 + rollover
    const h = Math.floor(totalNewHours)
    const m = Math.round((totalNewHours - h) * 60)

    newBalance = { hours: h, minutes: m }
  }

  // 3. Clear Top-Ups
  let newPurchasedBlocks = purchasedBlocks
  if (clearTopUpsOnRenewal) {
    newPurchasedBlocks = 0
  }

  return {
    didRenew: true,
    newRenewalDate: formattedDate,
    newBalance,
    newPurchasedBlocks,
  }
}
