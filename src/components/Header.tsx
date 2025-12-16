import React from 'react'
import { Monitor, Github, Download, Settings, X } from 'lucide-react'
import { BeforeInstallPromptEvent } from '../types'

interface HeaderProps {
  installPromptEvent: BeforeInstallPromptEvent | null
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  handleInstallClick: () => void
}

const Header: React.FC<HeaderProps> = ({
  installPromptEvent,
  showSettings,
  setShowSettings,
  handleInstallClick,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222] p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Monitor className="text-[#76b900]" />
        <h1 className="text-xl font-bold tracking-tight text-white">
          GFN <span className="text-[#76b900]">Tracker</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/skylark95/gfn-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-[#222] text-gray-400 hover:bg-[#333] transition-colors"
          title="GitHub Repository"
        >
          <Github />
        </a>
        {installPromptEvent && (
          <button
            onClick={handleInstallClick}
            className="p-2 rounded-full bg-blue-600 text-white animate-fade-in"
            title="Install App"
          >
            <Download />
          </button>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-[#76b900] text-black' : 'bg-[#222] text-gray-400'}`}
        >
          {showSettings ? <X /> : <Settings />}
        </button>
      </div>
    </div>
  )
}

export default Header
