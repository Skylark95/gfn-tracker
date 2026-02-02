import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, mock } from 'bun:test'
import Dashboard from './Dashboard'
import { PLANS } from '../utils/calculations'

describe('Dashboard', () => {
  const mockProps = {
    balance: { hours: 10, minutes: 0 },
    setBalance: mock(),
    setExcludeRollover: mock(),
    excludeRollover: false,
    calculatedData: {
      daysRemaining: 10,
      totalCurrentHours: 10,
      effectiveHours: 10,
      budgetPerDay: 1,
      totalCost: 9.99,
      planDetails: PLANS.performance,
    },
    plan: 'performance',
    renewalDate: '',
    purchasedBlocks: 0,
  }

  it('renders daily budget and cost', () => {
    render(<Dashboard {...mockProps} />)
    expect(screen.getByText('1h 0m')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
  })

  it('renders plan summary', () => {
    render(<Dashboard {...mockProps} />)
    expect(screen.getByText('Performance Plan')).toBeInTheDocument()
  })

  it('toggles exclude rollover checkbox', () => {
    render(<Dashboard {...mockProps} />)
    // Find the checkbox input (it has class sr-only)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockProps.setExcludeRollover).toHaveBeenCalledWith(true)
  })

  it('updates balance inputs', () => {
    render(<Dashboard {...mockProps} />)
    const inputs = screen.getAllByPlaceholderText('00')
    const hoursInput = inputs[0]

    fireEvent.change(hoursInput, { target: { value: '20' } })
    // We expect the state setter to be called with a function updater
    expect(mockProps.setBalance).toHaveBeenCalled()
  })
})
