import { render, screen, fireEvent } from '@testing-library/react'
import SettingsPanel from './SettingsPanel'
import { describe, it, expect, vi } from 'vitest'
import { PLANS } from '../utils/calculations'

describe('SettingsPanel', () => {
  const mockProps = {
    plan: 'performance',
    setPlan: vi.fn(),
    renewalDate: '',
    setRenewalDate: vi.fn(),
    purchasedBlocks: 0,
    setPurchasedBlocks: vi.fn(),
    currentPlanDetails: PLANS.performance,
    onClose: vi.fn(),
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
})
