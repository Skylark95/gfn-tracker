import { Plan, Balance } from '../types'

// Constants
export const ROLLOVER_HOURS = 15
export const TOP_UP_HOURS = 15

// Pricing Constants (based on late 2024/early 2025 data)
export const PLANS: Record<string, Plan> = {
  performance: {
    name: 'Performance',
    basePrice: 9.99,
    topUpPrice: 2.99,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  ultimate: {
    name: 'Ultimate',
    basePrice: 19.99,
    topUpPrice: 5.99,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
}

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)
}

export const formatHours = (decimalHours: number) => {
  const h = Math.floor(decimalHours)
  const m = Math.round((decimalHours - h) * 60)
  return `${h}h ${m}m`
}

export const calculateData = (
  plan: string,
  balance: Balance,
  renewalDate: string,
  purchasedBlocks: number,
  excludeRollover: boolean
) => {
  const now = new Date()
  const renewal = renewalDate ? new Date(renewalDate) : null

  let daysRemaining = 0

  if (renewal && renewal > now) {
    const diffTime = Math.abs(renewal.getTime() - now.getTime())
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Total current balance in decimal hours
  let totalCurrentHours =
    parseFloat(String(balance.hours)) +
    parseFloat(String(balance.minutes)) / 60

  // Effective Balance (Handle Rollover Exclusion)
  let effectiveHours = excludeRollover
    ? Math.max(0, totalCurrentHours - ROLLOVER_HOURS)
    : totalCurrentHours

  const budgetPerDay = daysRemaining > 0 ? effectiveHours / daysRemaining : 0

  // Cost Calculation
  const currentPlan = PLANS[plan] || PLANS.performance
  const totalCost =
    currentPlan.basePrice + purchasedBlocks * currentPlan.topUpPrice

  return {
    daysRemaining,
    totalCurrentHours,
    effectiveHours,
    budgetPerDay,
    totalCost,
    planDetails: currentPlan,
  }
}
