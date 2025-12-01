# Project Overview

This project is a single-file, self-contained web application for tracking GeForce NOW (GFN) usage. It's designed to be a Progressive Web App (PWA) that can be saved to a device's home screen for offline use. The application allows users to track their remaining GFN hours, calculate daily usage budgets, and estimate monthly costs based on their plan and any top-ups.

## Key Technologies

*   **Framework:** React (loaded via CDN)
*   **Styling:** Tailwind CSS (loaded via CDN)
*   **Icons:** Lucide Icons (loaded via CDN)
*   **Language:** JavaScript (ES6+ with JSX)
*   **Data Storage:** Browser Local Storage

## Architecture

The entire application is contained within `index.html`. It uses a standard React functional component structure with hooks (`useState`, `useEffect`, `useMemo`). There is no build process or server-side component. All data is stored and retrieved from the browser's local storage, making it a purely client-side application.

# Building and Running

This is a single-file web application with no build process. To run the project, simply open the `index.html` file in a web browser.

## To run the application:

1.  Clone the repository.
2.  Open the `index.html` file in a modern web browser that supports the technologies used (React, Tailwind CSS, etc.).

# Development Conventions

*   **Code Style:** The code follows standard React and JSX conventions. It uses functional components and hooks.
*   **Dependencies:** All dependencies are loaded from CDNs, as specified in the `<head>` of the `index.html` file.
*   **Data Persistence:** Application state is persisted in the browser's local storage under the key `gfn-tracker-data`.
*   **PWA:** The application is configured as a PWA through a data URI manifest and meta tags in the HTML.
