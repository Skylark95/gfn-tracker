import React, { useState, useEffect, useMemo } from 'react'
import './input.css'

import { Balance, BeforeInstallPromptEvent, BillingCycle } from './types'
import { calculateData } from './utils/calculations'
import { checkRenewal } from './utils/renewal'

import Header from './components/Header'
import SettingsPanel from './components/SettingsPanel'
import Dashboard from './components/Dashboard'

// --- Constants ---
const LOCAL_STORAGE_KEY = 'gfn-tracker-data'

const App: React.FC = () => {
  // --- State Initialization ---

  const getInitialData = () => {
    let saved: Record<string, unknown> = {}
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedData) {
        saved = JSON.parse(savedData)
      }
    } catch (e) {
      console.error('Failed to load data', e)
    }

    // Default Values
    const defaults = {
      plan: 'performance',
      billingCycle: 'monthly' as BillingCycle,
      balance: { hours: 100, minutes: 0 },
      renewalDate: '',
      purchasedBlocks: 0,
      excludeRollover: false,
      autoRenew: true,
      resetBalanceOnRenewal: true,
      includeRollover: true,
      clearTopUpsOnRenewal: true,
    }

    // Merge saved with defaults
    const savedBalance = saved.balance as Balance | undefined

    const currentData = {
      plan: (saved.plan as string) ?? defaults.plan,
      billingCycle: (saved.billingCycle as BillingCycle) ?? defaults.billingCycle,
      balance: {
        hours: savedBalance?.hours ?? defaults.balance.hours,
        minutes: savedBalance?.minutes ?? defaults.balance.minutes,
      },
      renewalDate: (saved.renewalDate as string) ?? defaults.renewalDate,
      purchasedBlocks: (saved.purchasedBlocks as number) ?? defaults.purchasedBlocks,
      excludeRollover: (saved.excludeRollover as boolean) ?? defaults.excludeRollover,
      autoRenew: (saved.autoRenew as boolean) ?? defaults.autoRenew,
      resetBalanceOnRenewal: (saved.resetBalanceOnRenewal as boolean) ?? defaults.resetBalanceOnRenewal,
      includeRollover: (saved.includeRollover as boolean) ?? defaults.includeRollover,
      clearTopUpsOnRenewal: (saved.clearTopUpsOnRenewal as boolean) ?? defaults.clearTopUpsOnRenewal,
    }

    // Perform Renewal Check on the raw data
    const renewalResult = checkRenewal({
      renewalDate: currentData.renewalDate,
      autoRenew: currentData.autoRenew,
      resetBalanceOnRenewal: currentData.resetBalanceOnRenewal,
      includeRollover: currentData.includeRollover,
      clearTopUpsOnRenewal: currentData.clearTopUpsOnRenewal,
      balance: currentData.balance,
      purchasedBlocks: currentData.purchasedBlocks,
    })

    if (renewalResult.didRenew) {
      if (renewalResult.newRenewalDate) currentData.renewalDate = renewalResult.newRenewalDate
      if (renewalResult.newBalance) currentData.balance = renewalResult.newBalance
      if (renewalResult.newPurchasedBlocks !== undefined) currentData.purchasedBlocks = renewalResult.newPurchasedBlocks
    }

    return currentData
  }

  const [initialData] = useState(() => getInitialData())

  const [plan, setPlan] = useState<string>(initialData.plan)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialData.billingCycle)
  const [balance, setBalance] = useState<Balance>(initialData.balance)
  const [renewalDate, setRenewalDate] = useState<string>(initialData.renewalDate)
  const [purchasedBlocks, setPurchasedBlocks] = useState<number>(initialData.purchasedBlocks)
  const [excludeRollover, setExcludeRollover] = useState<boolean>(initialData.excludeRollover)
  const [autoRenew, setAutoRenew] = useState<boolean>(initialData.autoRenew)
  const [resetBalanceOnRenewal, setResetBalanceOnRenewal] = useState<boolean>(initialData.resetBalanceOnRenewal)
  const [includeRollover, setIncludeRollover] = useState<boolean>(initialData.includeRollover)
  const [clearTopUpsOnRenewal, setClearTopUpsOnRenewal] = useState<boolean>(initialData.clearTopUpsOnRenewal)

  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)

  // --- Effects ---

  // Handle PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
    }
  }, [])

  // Save to Local Storage on change
  useEffect(() => {
    const data = {
      plan,
      billingCycle,
      balance,
      renewalDate,
      purchasedBlocks,
      excludeRollover,
      autoRenew,
      resetBalanceOnRenewal,
      includeRollover,
      clearTopUpsOnRenewal,
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }, [
    plan,
    billingCycle,
    balance,
    renewalDate,
    purchasedBlocks,
    excludeRollover,
    autoRenew,
    resetBalanceOnRenewal,
    includeRollover,
    clearTopUpsOnRenewal,
  ])

  // --- Calculations ---

  const calculatedData = useMemo(() => {
    return calculateData(
      plan,
      billingCycle,
      balance,
      renewalDate,
      purchasedBlocks,
      excludeRollover
    )
  }, [plan, billingCycle, balance, renewalDate, purchasedBlocks, excludeRollover])

  // --- Helpers ---

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt()
      installPromptEvent.userChoice.then(
        (choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt')
          } else {
            console.log('User dismissed the install prompt')
          }
          setInstallPromptEvent(null)
        }
      )
    }
  }

  // --- Render ---

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-10 sm:pb-0">
      <Header
        installPromptEvent={installPromptEvent}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        handleInstallClick={handleInstallClick}
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Settings Panel (Toggleable) */}
        {showSettings ? (
          <SettingsPanel
            plan={plan}
            setPlan={setPlan}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            renewalDate={renewalDate}
            setRenewalDate={setRenewalDate}
            purchasedBlocks={purchasedBlocks}
            setPurchasedBlocks={setPurchasedBlocks}
            currentPlanDetails={calculatedData.planDetails}
            onClose={() => setShowSettings(false)}
            autoRenew={autoRenew}
            setAutoRenew={setAutoRenew}
            resetBalanceOnRenewal={resetBalanceOnRenewal}
            setResetBalanceOnRenewal={setResetBalanceOnRenewal}
            includeRollover={includeRollover}
            setIncludeRollover={setIncludeRollover}
            clearTopUpsOnRenewal={clearTopUpsOnRenewal}
            setClearTopUpsOnRenewal={setClearTopUpsOnRenewal}
          />
        ) : (
          /* Dashboard View */
          <Dashboard
            balance={balance}
            setBalance={setBalance}
            excludeRollover={excludeRollover}
            setExcludeRollover={setExcludeRollover}
            calculatedData={calculatedData}
            plan={plan}
            renewalDate={renewalDate}
            purchasedBlocks={purchasedBlocks}
          />
        )}

        <div className="text-center text-[10px] text-gray-600 mt-10">
          GeForce NOW™ is a trademark of NVIDIA Corporation.
          <br />
          This app is a community tool and not affiliated with NVIDIA.
          <br />
          This application was completely written using <a href="https://github.com/google-gemini/gemini-cli" target="_blank" rel="noopener noreferrer">gemini-cli</a>.
        </div>
      </div>
    </div>
  )
}

export default App
