import { Balance } from '../types'
import { ROLLOVER_HOURS } from './calculations'

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

  const currentRenewal = new Date(renewalDate)
  if (isNaN(currentRenewal.getTime())) {
    return { didRenew: false }
  }

  if (currentRenewal.getTime() > now) {
    return { didRenew: false }
  }

  // Perform Renewal

  // 1. Advance Date 1 Month
  // Note: setMonth handles rollover (e.g. Jan 31 -> Feb 28/29) automatically in JS Date
  const newDate = new Date(currentRenewal)
  newDate.setMonth(newDate.getMonth() + 1)

  // Format to string (assuming ISO or similar that fits the input type, usually input="datetime-local" uses YYYY-MM-DDTHH:mm)
  // To keep it simple and consistent with input type="datetime-local", we output ISO string sliced.
  // However, JS toISOString is UTC. The input usually works with local time if not careful.
  // Let's assume the stored format is what `new Date()` can parse and we return similar.
  // The app uses `type="datetime-local"` which expects `YYYY-MM-DDTHH:mm`.
  // Let's try to preserve the timezone offset or just use local formatting.
  // A simple way to keep format consistent if it was already in a parseable format:
  // Using a library like date-fns would be better, but we stick to vanilla.
  const pad = (n: number) => n.toString().padStart(2, '0')
  const formattedDate = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}T${pad(newDate.getHours())}:${pad(newDate.getMinutes())}`


  // 2. Reset Balance Logic
  let newBalance = { ...balance }

  if (resetBalanceOnRenewal) {
    let rollover = 0
    if (includeRollover) {
      const currentHours = balance.hours + balance.minutes / 60
      rollover = Math.min(currentHours, ROLLOVER_HOURS)
    }

    // 100 base + rollover. Convert to hours/minutes.
    // Assuming rollover is just added to hours directly since it's capped at 15 and we usually deal with integer hours for base.
    // But wait, rollover might have decimals?
    // The requirement says "up to a maximum of 15 hours".
    // If I have 10.5 hours, do I get 110h 30m? Yes.

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
