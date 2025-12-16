import React from 'react'
import { CreditCard, ShoppingCart } from 'lucide-react'
import { PLANS, TOP_UP_HOURS } from '../utils/calculations'
import { Plan } from '../types'

interface SettingsPanelProps {
  plan: string
  setPlan: (plan: string) => void
  renewalDate: string
  setRenewalDate: (date: string) => void
  purchasedBlocks: number
  setPurchasedBlocks: (blocks: number) => void
  currentPlanDetails: Plan
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  plan,
  setPlan,
  renewalDate,
  setRenewalDate,
  purchasedBlocks,
  setPurchasedBlocks,
  currentPlanDetails,
  onClose,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <section className="bg-[#151515] p-5 rounded-2xl border border-[#333]">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
          <CreditCard size="16" /> Plan Details
        </h2>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Object.keys(PLANS).map((key) => (
            <button
              key={key}
              onClick={() => setPlan(key)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                plan === key
                  ? `${PLANS[key].bg} ${PLANS[key].border} ${PLANS[key].color} ring-1 ring-offset-0 ring-current`
                  : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:bg-[#222]'
              }`}
            >
              <span className="font-bold">{PLANS[key].name}</span>
              <span className="text-xs opacity-70">
                ${PLANS[key].basePrice}/mo
              </span>
            </button>
          ))}
        </div>

        {/* Renewal Date */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Renewal Date</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] text-white p-3 rounded-xl focus:outline-none focus:border-[#76b900] transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#151515] p-5 rounded-2xl border border-[#333]">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart /> Top-ups
        </h2>
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-300">Blocks Purchased</label>
          <span className="text-xs text-[#76b900] font-mono bg-[#76b900]/10 px-2 py-1 rounded">
            +{TOP_UP_HOURS} hrs each
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPurchasedBlocks(Math.max(0, purchasedBlocks - 1))}
            className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center text-xl hover:bg-[#333] active:scale-95 transition-transform"
          >
            -
          </button>
          <div className="flex-1 bg-[#1a1a1a] h-12 rounded-xl flex items-center justify-center font-mono text-xl border border-[#333]">
            {purchasedBlocks}
          </div>
          <button
            onClick={() => setPurchasedBlocks(purchasedBlocks + 1)}
            className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center text-xl hover:bg-[#333] active:scale-95 transition-transform"
          >
            +
          </button>
        </div>
        <p className="text-right text-xs text-gray-500 mt-2">
          Cost per block: ${currentPlanDetails.topUpPrice}
        </p>
      </section>

      <button
        onClick={onClose}
        className="w-full bg-[#76b900] text-black font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(118,185,0,0.39)] hover:bg-[#88d600] active:scale-95 transition-all"
      >
        Save & View Dashboard
      </button>
    </div>
  )
}

export default SettingsPanel
