import React from 'react'
import {
  CalendarClock,
  DollarSign,
  Zap,
  Server,
} from 'lucide-react'
import { ROLLOVER_HOURS, formatCurrency, formatHours } from '../utils/calculations'
import { Balance, BillingCycle, Plan } from '../types'

interface DashboardProps {
  balance: Balance
  setBalance: React.Dispatch<React.SetStateAction<Balance>>
  excludeRollover: boolean
  setExcludeRollover: (exclude: boolean) => void
  calculatedData: {
    daysRemaining: number
    totalCurrentHours: number
    effectiveHours: number
    budgetPerDay: number
    totalCost: number
    planDetails: Plan
  }
  plan: string
  billingCycle: BillingCycle
  renewalDate: string
  purchasedBlocks: number
}

const Dashboard: React.FC<DashboardProps> = ({
  balance,
  setBalance,
  excludeRollover,
  setExcludeRollover,
  calculatedData,
  plan,
  billingCycle,
  renewalDate,
  purchasedBlocks,
}) => {
  const handleBalanceChange = (part: keyof Balance, value: string) => {
    setBalance((prev) => ({ ...prev, [part]: value }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Input: Balance */}
      <div className="bg-[#151515] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#76b900] to-transparent opacity-50"></div>

        <div className="flex justify-between items-start mb-6">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Remaining Balance
          </h2>
          <div className="flex flex-col items-end">
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                Exclude Rollover ({ROLLOVER_HOURS}h)
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={excludeRollover}
                  onChange={(e) => setExcludeRollover(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 bg-[#222] rounded-full border border-[#444] transition-colors ${excludeRollover ? 'border-[#76b900] bg-[#76b900]/20' : ''}`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${excludeRollover ? 'translate-x-4 bg-[#76b900]' : ''}`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Hours</label>
            <input
              type="number"
              min="0"
              value={balance.hours}
              onChange={(e) => handleBalanceChange('hours', e.target.value)}
              className="w-full bg-[#0a0a0a] text-3xl sm:text-4xl font-mono font-bold text-white border-b-2 border-[#333] focus:border-[#76b900] focus:outline-none py-2 text-center transition-colors placeholder-gray-700"
              placeholder="00"
            />
          </div>
          <div className="text-2xl text-gray-600 pb-4">:</div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={balance.minutes}
              onChange={(e) => handleBalanceChange('minutes', e.target.value)}
              className="w-full bg-[#0a0a0a] text-3xl sm:text-4xl font-mono font-bold text-white border-b-2 border-[#333] focus:border-[#76b900] focus:outline-none py-2 text-center transition-colors placeholder-gray-700"
              placeholder="00"
            />
          </div>
        </div>

        {excludeRollover && (
          <div className="mt-4 text-center text-xs text-[#76b900] bg-[#76b900]/10 py-1 px-2 rounded border border-[#76b900]/20">
            Safe Mode: {ROLLOVER_HOURS}h hidden from budget
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Budget Card */}
        <div className="bg-[#151515] p-5 rounded-2xl border border-[#333] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <CalendarClock />
            </div>
            <span className="text-xs font-mono text-gray-500">
              {calculatedData.daysRemaining} days left
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Daily Budget
            </p>
            <p className="text-2xl text-white font-bold mt-1">
              {formatHours(calculatedData.budgetPerDay)}
              <span className="text-sm font-normal text-gray-500"> /day</span>
            </p>
          </div>
        </div>

        {/* Cost Card */}
        <div className="bg-[#151515] p-5 rounded-2xl border border-[#333] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-500/10 rounded-lg text-[#76b900]">
              <DollarSign />
            </div>
            {purchasedBlocks > 0 && (
              <span className="text-xs font-mono text-gray-500">
                +{purchasedBlocks} blocks
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Est. Monthly Cost
            </p>
            <p className="text-2xl text-white font-bold mt-1">
              {formatCurrency(
                billingCycle === 'yearly'
                  ? calculatedData.planDetails.yearlyPrice / 12 +
                      purchasedBlocks * calculatedData.planDetails.topUpPrice
                  : calculatedData.totalCost
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Summary */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${calculatedData.planDetails.bg} ${calculatedData.planDetails.border}`}
      >
        <div className="flex items-center gap-3">
          {plan === 'ultimate' ? (
            <Zap className={calculatedData.planDetails.color} />
          ) : (
            <Server className={calculatedData.planDetails.color} />
          )}
          <div>
            <p className={`font-bold ${calculatedData.planDetails.color}`}>
              {calculatedData.planDetails.name} Plan
            </p>
            <p className="text-xs text-gray-300 opacity-80">
              100h Base Allowance
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Renewal</p>
          <p className="text-sm font-mono text-white">
            {renewalDate
              ? new Date(renewalDate).toLocaleDateString()
              : 'Set Date'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
