import { Balance } from '../types'
import { ROLLOVER_HOURS } from './calculations'
import { addMonths, format, isValid } from 'date-fns'

/**
 * Options for checking and calculating renewal state.
 */
export interface RenewalOptions {
  /** Current timestamp (ms). Defaults to Date.now() if not provided. */
  now?: number
  /** The current renewal date string (ISO format preferred). */
  renewalDate: string
  /** Whether auto-renewal is enabled. */
  autoRenew: boolean
  /** Whether to reset the balance to the base amount (100h) upon renewal. */
  resetBalanceOnRenewal: boolean
  /** Whether to include unused hours (capped at ROLLOVER_HOURS) in the new balance. */
  includeRollover: boolean
  /** Whether to clear purchased top-up blocks upon renewal. */
  clearTopUpsOnRenewal: boolean
  /** The current balance. */
  balance: Balance
  /** The number of currently purchased top-up blocks. */
  purchasedBlocks: number
}

/**
 * Result of the renewal check.
 */
export interface RenewalResult {
  /** True if a renewal occurred (date was passed and auto-renew was on). */
  didRenew: boolean
  /** The new renewal date string (if renewed). */
  newRenewalDate?: string
  /** The new balance (if renewed). */
  newBalance?: Balance
  /** The new number of purchased blocks (if renewed). */
  newPurchasedBlocks?: number
}

/**
 * Checks if the plan needs renewal and calculates the new state if so.
 *
 * This pure function encapsulates the core business logic for the monthly reset:
 * 1. Checks if `renewalDate` is in the past relative to `now`.
 * 2. Advances the renewal date by 1 month.
 * 3. Resets balance to base 100 hours + rollover (capped at 15h) if configured.
 * 4. Clears top-ups if configured.
 *
 * @param options - Configuration and current state.
 * @returns The result indicating if renewal happened and the new state values.
 */
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

  // 1. Pre-checks: If auto-renew is off or no date is set, do nothing.
  if (!autoRenew || !renewalDate) {
    return { didRenew: false }
  }

  // Validate the current renewal date
  const currentRenewal = new Date(renewalDate)
  if (!isValid(currentRenewal)) {
    return { didRenew: false }
  }

  // 2. Timing Check: Has the renewal date passed?
  if (currentRenewal.getTime() > now) {
    return { didRenew: false }
  }

  // --- Perform Renewal Logic ---

  // 3. Date Advancement
  // Advance the date by exactly 1 month using date-fns to handle varying month lengths correctly.
  const newDate = addMonths(currentRenewal, 1)

  // Format to string compatible with input type="datetime-local" (YYYY-MM-DDTHH:mm)
  const formattedDate = format(newDate, "yyyy-MM-dd'T'HH:mm")

  // 4. Balance Calculation
  let newBalance = { ...balance }

  if (resetBalanceOnRenewal) {
    let rollover = 0
    // Calculate rollover if enabled
    if (includeRollover) {
      const currentHours = balance.hours + balance.minutes / 60
      // Rollover is capped at ROLLOVER_HOURS (15h)
      rollover = Math.min(currentHours, ROLLOVER_HOURS)
    }

    // Base plan includes 100 hours. Add rollover.
    const totalNewHours = 100 + rollover

    // Convert back to hours and minutes
    const h = Math.floor(totalNewHours)
    const m = Math.round((totalNewHours - h) * 60)

    newBalance = { hours: h, minutes: m }
  }

  // 5. Top-up Reset
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
