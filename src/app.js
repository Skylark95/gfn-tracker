const { useState, useEffect, useMemo } = React;

// --- Constants ---
const LOCAL_STORAGE_KEY = 'gfn-tracker-data';
const ROLLOVER_HOURS = 15;
const TOP_UP_HOURS = 15;

// Pricing Constants (based on late 2024/early 2025 data)
const PLANS = {
    performance: {
        name: 'Performance',
        basePrice: 9.99,
        topUpPrice: 2.99,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/20'
    },
    ultimate: {
        name: 'Ultimate',
        basePrice: 19.99,
        topUpPrice: 5.99,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20'
    }
};

const App = () => {
    // --- State ---
    const [plan, setPlan] = useState('performance');
    const [balance, setBalance] = useState({ hours: 100, minutes: 0 });
    const [renewalDate, setRenewalDate] = useState('');
    const [purchasedBlocks, setPurchasedBlocks] = useState(0);
    const [excludeRollover, setExcludeRollover] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [installPromptEvent, setInstallPromptEvent] = useState(null);

    // --- Effects ---

    // Handle PWA installation prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Load from Local Storage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setPlan(parsed.plan || 'performance');
                setBalance({
                    hours: parsed.balance?.hours ?? 100,
                    minutes: parsed.balance?.minutes ?? 0
                });
                setRenewalDate(parsed.renewalDate || '');
                setPurchasedBlocks(parsed.purchasedBlocks ?? 0);
                setExcludeRollover(parsed.excludeRollover ?? false);
            } catch (e) {
                console.error("Failed to load data", e);
            }
        }
    }, []);

    // Save to Local Storage on change
    useEffect(() => {
        const data = {
            plan,
            balance,
            renewalDate,
            purchasedBlocks,
            excludeRollover
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
    }, [plan, balance, renewalDate, purchasedBlocks, excludeRollover]);

    // Create/Refresh icons when UI changes
    useEffect(() => {
        lucide.createIcons();
    }, [showSettings, plan, installPromptEvent]);

    // --- Calculations ---

    const calculatedData = useMemo(() => {
        const now = new Date();
        const renewal = renewalDate ? new Date(renewalDate) : null;
        
        let daysRemaining = 0;
        
        if (renewal && renewal > now) {
            const diffTime = Math.abs(renewal - now);
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        }

        // Total current balance in decimal hours
        let totalCurrentHours = parseFloat(balance.hours) + (parseFloat(balance.minutes) / 60);
        
        // Effective Balance (Handle Rollover Exclusion)
        let effectiveHours = excludeRollover 
            ? Math.max(0, totalCurrentHours - ROLLOVER_HOURS) 
            : totalCurrentHours;

        const budgetPerDay = daysRemaining > 0 ? (effectiveHours / daysRemaining) : 0;
        
        // Cost Calculation
        const currentPlan = PLANS[plan];
        const totalCost = currentPlan.basePrice + (purchasedBlocks * currentPlan.topUpPrice);

        return {
            daysRemaining,
            totalCurrentHours,
            effectiveHours,
            budgetPerDay,
            totalCost,
            planDetails: currentPlan
        };
    }, [plan, balance, renewalDate, purchasedBlocks, excludeRollover]);

    // --- Helpers ---

    const handleInstallClick = () => {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            installPromptEvent.userChoice.then(choiceResult => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                setInstallPromptEvent(null);
            });
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatHours = (decimalHours) => {
        const h = Math.floor(decimalHours);
        const m = Math.round((decimalHours - h) * 60);
        return `${h}h ${m}m`;
    };

    const handleBalanceChange = (part, value) => {
        setBalance(prev => ({ ...prev, [part]: value }));
    };

    // --- Render ---

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-10 sm:pb-0">
            
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <i data-lucide="monitor" className="text-[#76b900]"></i>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        GFN <span className="text-[#76b900]">Tracker</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {installPromptEvent && (
                        <button 
                            onClick={handleInstallClick}
                            className="p-2 rounded-full bg-blue-600 text-white animate-fade-in"
                            title="Install App"
                        >
                            <i data-lucide="download"></i>
                        </button>
                    )}
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-[#76b900] text-black' : 'bg-[#222] text-gray-400'}`}
                    >
                        <i data-lucide={showSettings ? "x" : "settings"}></i>
                    </button>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">
                
                {/* Settings Panel (Toggleable) */}
                {showSettings ? (
                    <div className="space-y-6 animate-fade-in">
                        <section className="bg-[#151515] p-5 rounded-2xl border border-[#333]">
                            <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                                <i data-lucide="credit-card" size="16"></i> Plan Details
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
                                        <span className="text-xs opacity-70">${PLANS[key].basePrice}/mo</span>
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
                                <i data-lucide="shopping-cart" size="16"></i> Top-ups
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
                                >-</button>
                                <div className="flex-1 bg-[#1a1a1a] h-12 rounded-xl flex items-center justify-center font-mono text-xl border border-[#333]">
                                    {purchasedBlocks}
                                </div>
                                <button 
                                    onClick={() => setPurchasedBlocks(purchasedBlocks + 1)}
                                    className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center text-xl hover:bg-[#333] active:scale-95 transition-transform"
                                >+</button>
                            </div>
                            <p className="text-right text-xs text-gray-500 mt-2">
                                Cost per block: ${calculatedData.planDetails.topUpPrice}
                            </p>
                        </section>

                        <button 
                            onClick={() => setShowSettings(false)}
                            className="w-full bg-[#76b900] text-black font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(118,185,0,0.39)] hover:bg-[#88d600] active:scale-95 transition-all"
                        >
                            Save & View Dashboard
                        </button>
                    </div>
                ) : (
                    /* Dashboard View */
                    <div className="space-y-6 animate-fade-in">
                        
                        {/* Main Input: Balance */}
                        <div className="bg-[#151515] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#76b900] to-transparent opacity-50"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Remaining Balance</h2>
                                <div className="flex flex-col items-end">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">Exclude Rollover ({ROLLOVER_HOURS}h)</span>
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                checked={excludeRollover}
                                                onChange={(e) => setExcludeRollover(e.target.checked)}
                                                className="sr-only" 
                                            />
                                            <div className={`w-10 h-6 bg-[#222] rounded-full border border-[#444] transition-colors ${excludeRollover ? 'border-[#76b900] bg-[#76b900]/20' : ''}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${excludeRollover ? 'translate-x-4 bg-[#76b900]' : ''}`}></div>
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
                                        <i data-lucide="calendar-clock"></i>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">{calculatedData.daysRemaining} days left</span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Daily Budget</p>
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
                                        <i data-lucide="dollar-sign"></i>
                                    </div>
                                    {purchasedBlocks > 0 && (
                                        <span className="text-xs font-mono text-gray-500">+{purchasedBlocks} blocks</span>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Est. Monthly Cost</p>
                                    <p className="text-2xl text-white font-bold mt-1">
                                        {formatCurrency(calculatedData.totalCost)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Plan Summary */}
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${calculatedData.planDetails.bg} ${calculatedData.planDetails.border}`}>
                            <div className="flex items-center gap-3">
                                <i data-lucide={plan === 'ultimate' ? "zap" : "server"} className={calculatedData.planDetails.color}></i>
                                <div>
                                    <p className={`font-bold ${calculatedData.planDetails.color}`}>{calculatedData.planDetails.name} Plan</p>
                                    <p className="text-xs text-gray-300 opacity-80">100h Base Allowance</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Renewal</p>
                                <p className="text-sm font-mono text-white">
                                    {renewalDate ? new Date(renewalDate).toLocaleDateString() : 'Set Date'}
                                </p>
                            </div>
                        </div>

                    </div>
                )}
                
                <div className="text-center text-[10px] text-gray-600 mt-10">
                    GeForce NOW™ is a trademark of NVIDIA Corporation.<br/>
                    This app is a community tool and not affiliated with NVIDIA.
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
