# Project Overview

This project is a web application for tracking GeForce NOW (GFN) usage. It's designed to be a Progressive Web App (PWA) that can be saved to a device's home screen for offline use. The application allows users to track their remaining GFN hours, calculate daily usage budgets, and estimate monthly costs based on their plan and any top-ups.

## Key Technologies

- **Build Tool:** Vite
- **Framework:** React
- **Styling:** Tailwind CSS
- **Icons:** Lucide Icons (via `lucide-react`)
- **Language:** TypeScript
- **Data Storage:** Browser Local Storage

## Architecture

The application is built using Vite, which provides a modern, fast development environment and build process.

- **`index.html`**: The root `index.html` file serves as the main template for the application.
- **`src/main.tsx`**: This is the main entry point for the React application.
- **`src/App.tsx`**: This is the main React component.
- **`public/`**: This directory contains static assets like `manifest.json` and the application icon, which are copied directly to the build output.
- **Dependencies**: All project dependencies are managed via npm in the `package.json` file.
- **Data Persistence**: Application state is persisted in the browser's local storage under the key `gfn-tracker-data`.

## TypeScript Migration

The project has been migrated from JavaScript to TypeScript. This involved:

- Renaming `.js` and `.jsx` files to `.ts` and `.tsx` respectively.
- Adding `tsconfig.json` and `tsconfig.node.json` for TypeScript configuration.
- Updating `vite.config.js` to `vite.config.ts` and integrating `vite-tsconfig-paths`.
- Creating `src/main.tsx` as the new application entry point.
- Updating the `App` component with TypeScript types.
- Installing necessary TypeScript and type definition dependencies.
- Re-establishing PostCSS configuration to correctly generate Tailwind CSS.

# Building and Running

The project now uses a Vite-based build process. To run the application, you'll need to have Node.js and npm installed.

## To run the application for development:

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

This will start a local development server with Hot Module Replacement (HMR).

## To build for production:

1.  Run the build command: `npm run build`
2.  The production-ready files will be generated in the `dist/` directory.

You can preview the production build locally with `npm run preview`.

# Development Conventions

- **Code Style:** The code follows standard React and TypeScript conventions. It uses functional components and hooks.
- **Dependencies:** All dependencies are managed via npm and are listed in the `package.json` file.
- **PWA:** The application is configured as a PWA through a `public/manifest.json` file.
