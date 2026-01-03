import React, { useState, useEffect, useMemo } from 'react'
import './input.css'

import { Balance, BeforeInstallPromptEvent } from './types'
import { calculateData } from './utils/calculations'
import { checkRenewal } from './utils/renewal'

import Header from './components/Header'
import SettingsPanel from './components/SettingsPanel'
import Dashboard from './components/Dashboard'

// --- Constants ---
const LOCAL_STORAGE_KEY = 'gfn-tracker-data'

const App: React.FC = () => {
  // --- State Initialization from Local Storage ---
  const getInitialState = <T extends string | Balance | number | boolean>(key: string, defaultValue: T): T => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (key === 'balance') {
          return {
            hours: parsed.balance?.hours ?? (defaultValue as Balance).hours,
            minutes: parsed.balance?.minutes ?? (defaultValue as Balance).minutes,
          } as T;
        }
        return parsed[key] ?? defaultValue;
      }
    } catch (e) {
      console.error(`Failed to load ${key} from local storage`, e);
    }
    return defaultValue;
  };

  const [plan, setPlan] = useState<string>(() => getInitialState('plan', 'performance'));
  const [balance, setBalance] = useState<Balance>(() => getInitialState('balance', { hours: 100, minutes: 0 }));
  const [renewalDate, setRenewalDate] = useState<string>(() => getInitialState('renewalDate', ''));
  const [purchasedBlocks, setPurchasedBlocks] = useState<number>(() => getInitialState('purchasedBlocks', 0));
  const [excludeRollover, setExcludeRollover] = useState<boolean>(() => getInitialState('excludeRollover', false));
  const [autoRenew, setAutoRenew] = useState<boolean>(() => getInitialState('autoRenew', true));
  const [resetBalanceOnRenewal, setResetBalanceOnRenewal] = useState<boolean>(() => getInitialState('resetBalanceOnRenewal', true));
  const [includeRollover, setIncludeRollover] = useState<boolean>(() => getInitialState('includeRollover', true));
  const [clearTopUpsOnRenewal, setClearTopUpsOnRenewal] = useState<boolean>(() => getInitialState('clearTopUpsOnRenewal', true));

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  // --- Effects ---

  // Handle PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent); // Type assertion here
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Auto-renewal check on load (or when state changes relevantly)
  useEffect(() => {
    const result = checkRenewal({
      renewalDate,
      autoRenew,
      resetBalanceOnRenewal,
      includeRollover,
      clearTopUpsOnRenewal,
      balance,
      purchasedBlocks,
    })

    if (result.didRenew) {
      if (result.newRenewalDate) setRenewalDate(result.newRenewalDate)
      if (result.newBalance) setBalance(result.newBalance)
      if (result.newPurchasedBlocks !== undefined) setPurchasedBlocks(result.newPurchasedBlocks)
    }
  }, [renewalDate, autoRenew, resetBalanceOnRenewal, includeRollover, clearTopUpsOnRenewal, balance, purchasedBlocks])

  // Save to Local Storage on change
  useEffect(() => {
    const data = {
      plan,
      balance,
      renewalDate,
      purchasedBlocks,
      excludeRollover,
      autoRenew,
      resetBalanceOnRenewal,
      includeRollover,
      clearTopUpsOnRenewal,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [plan, balance, renewalDate, purchasedBlocks, excludeRollover, autoRenew, resetBalanceOnRenewal, includeRollover, clearTopUpsOnRenewal]);

  // --- Calculations ---

  const calculatedData = useMemo(() => {
    return calculateData(
      plan,
      balance,
      renewalDate,
      purchasedBlocks,
      excludeRollover
    )
  }, [plan, balance, renewalDate, purchasedBlocks, excludeRollover])

  // --- Helpers ---

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt()
      installPromptEvent.userChoice.then(
        (choiceResult) => { // Removed type assertion here, as it's not `any` anymore
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
