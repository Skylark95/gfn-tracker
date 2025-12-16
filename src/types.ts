// Pricing Constants (based on late 2024/early 2025 data)
export interface Plan {
  name: string
  basePrice: number
  topUpPrice: number
  color: string
  bg: string
  border: string
}

export interface Balance {
  hours: number
  minutes: number
}

// Define the BeforeInstallPromptEvent interface
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
