import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, mock } from 'bun:test'
import SettingsPanel from './SettingsPanel'
import { PLANS } from '../utils/calculations'

describe('SettingsPanel', () => {
  const mockProps = {
    plan: 'performance',
    setPlan: mock(),
    billingCycle: 'monthly' as const,
    setBillingCycle: mock(),
    renewalDate: '',
    setRenewalDate: mock(),
    purchasedBlocks: 0,
    setPurchasedBlocks: mock(),
    currentPlanDetails: PLANS.performance,
    onClose: mock(),
    autoRenew: true,
    setAutoRenew: mock(),
    resetBalanceOnRenewal: true,
    setResetBalanceOnRenewal: mock(),
    includeRollover: true,
    setIncludeRollover: mock(),
    clearTopUpsOnRenewal: true,
    setClearTopUpsOnRenewal: mock(),
  }

  it('renders plan details correctly', () => {
    render(<SettingsPanel {...mockProps} />)
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Ultimate')).toBeInTheDocument()
  })

  it('calls setPlan when a plan is selected', () => {
    render(<SettingsPanel {...mockProps} />)
    const ultimateButton = screen.getByText('Ultimate')
    fireEvent.click(ultimateButton)
    expect(mockProps.setPlan).toHaveBeenCalledWith('ultimate')
  })

  it('updates purchased blocks', () => {
    render(<SettingsPanel {...mockProps} />)
    const plusButton = screen.getByText('+')
    fireEvent.click(plusButton)
    expect(mockProps.setPurchasedBlocks).toHaveBeenCalledWith(1)
  })

  it('calls onClose when save button is clicked', () => {
    render(<SettingsPanel {...mockProps} />)
    const saveButton = screen.getByText('Save & View Dashboard')
    fireEvent.click(saveButton)
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('toggles auto renew option', () => {
    render(<SettingsPanel {...mockProps} />)
    const autoRenewCheckbox = screen.getByLabelText('Auto renew')
    fireEvent.click(autoRenewCheckbox)
    expect(mockProps.setAutoRenew).toHaveBeenCalledWith(false)
  })

  it('disables reset balance if auto renew is off', () => {
    render(<SettingsPanel {...mockProps} autoRenew={false} />)
    const resetCheckbox = screen.getByLabelText('Reset balance on renewal')
    expect(resetCheckbox).toBeDisabled()
  })

  it('disables rollover if reset balance is off', () => {
    render(<SettingsPanel {...mockProps} resetBalanceOnRenewal={false} />)
    const rolloverCheckbox = screen.getByLabelText('Include rollover')
    expect(rolloverCheckbox).toBeDisabled()
  })

  it('toggles billing cycle', () => {
    render(<SettingsPanel {...mockProps} />)
    const yearlyButton = screen.getByText('Yearly')
    fireEvent.click(yearlyButton)
    expect(mockProps.setBillingCycle).toHaveBeenCalledWith('yearly')
  })
})
