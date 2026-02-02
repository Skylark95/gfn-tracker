# Project Overview

This project is a web application for tracking GeForce NOW (GFN) usage. It's designed to be a Progressive Web App (PWA) that can be saved to a device's home screen for offline use. The application allows users to track their remaining GFN hours, calculate daily usage budgets, and estimate monthly costs based on their plan and any top-ups.

This document provides instructions and context for AI agents working on the codebase.

## Key Technologies

- **Build Tool:** Vite
- **Framework:** React
- **Styling:** Tailwind CSS
- **Icons:** Lucide Icons (via `lucide-react`)
- **Language:** TypeScript
- **Runtime & Test Runner:** Bun
- **Linting:** ESLint (with TypeScript and React plugins)
- **Formatting:** Prettier
- **Data Storage:** Browser Local Storage

## Architecture

The application is built using Vite, which provides a modern, fast development environment and build process.

- **`index.html`**: The root `index.html` file serves as the main template for the application.
- **`src/main.tsx`**: This is the main entry point for the React application.
- **`src/App.tsx`**: This is the main React component.
- **`src/components/`**: UI components (e.g., `Dashboard`, `SettingsPanel`, `Header`).
- **`src/utils/`**: Utility functions and logic (e.g., `calculations.ts`, `renewal.ts`).
- **`src/types.ts`**: Shared TypeScript definitions.
- **`eslint.config.js`**: The configuration file for ESLint, defining linting rules.
- **`.prettierrc`**: The configuration file for Prettier, defining code formatting rules.
- **`postcss.config.cjs`**: PostCSS configuration, used by Tailwind CSS.
- **`tailwind.config.cjs`**: Tailwind CSS configuration.
- **`public/`**: This directory contains static assets like `manifest.json` and the application icon, which are copied directly to the build output.
- **Dependencies**: All project dependencies are managed via Bun in the `bun.lock` file.
- **Data Persistence**: Application state is persisted in the browser's local storage under the key `gfn-tracker-data`.

# Building and Running

The project uses a Vite-based build process powered by Bun.

## To run the application for development:

1.  Install dependencies: `bun install`
2.  Start the development server: `bun run dev`

This will start a local development server with Hot Module Replacement (HMR).

## To build for production:

1.  Run the build command: `bun run build`
2.  The production-ready files will be generated in the `dist/` directory.

You can preview the production build locally with `bun run preview`.

# Testing

The project uses Bun's built-in test runner and React Testing Library for testing.

- **Run tests:** `bun test`
- **Test files:** Co-located with source files (e.g., `src/utils/calculations.test.ts`, `src/components/Dashboard.test.tsx`).

# Development Conventions

- **Code Style:** The code follows standard React, TypeScript, ESLint, and Prettier conventions. It uses functional components and hooks.
- **TypeScript:** The project is fully TypeScript. Ensure strict type safety and avoid `any` where possible.
- **Dependencies:** All dependencies are managed via Bun and are listed in the `package.json` file.
- **PWA:** The application is configured as a PWA through a `public/manifest.json` file.
- **Agent Guidelines:** When modifying code, ensure you:
    1.  Follow existing file organization (`src/components`, `src/utils`).
    2.  Update or add tests for new logic.
    3.  Run `bun run lint` and `bun test` before submitting changes.
    4.  Keep `src/types.ts` updated with any new shared types.
