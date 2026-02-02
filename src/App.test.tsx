import { render, screen } from '@testing-library/react'
import App from './App'
import { describe, it, expect } from 'bun:test'

describe('App Smoke Test', () => {
  it('renders the main application sections', () => {
    render(<App />)

    // Check for Header
    expect(screen.getByText('GFN')).toBeInTheDocument()
    expect(screen.getByText('Tracker')).toBeInTheDocument()

    // Check for Dashboard Main Elements
    expect(screen.getByText('Remaining Balance')).toBeInTheDocument()

    // Check for Inputs (Hours and Minutes both have placeholder "00")
    const inputs = screen.getAllByPlaceholderText('00')
    expect(inputs).toHaveLength(2)

    // Check for Settings Toggle
    // The button itself might not have text, but we can look for the icon's container or attribute if needed.
    // For now, let's verify the "Save & View Dashboard" button is NOT visible initially
    expect(screen.queryByText('Save & View Dashboard')).not.toBeInTheDocument()
  })
})
