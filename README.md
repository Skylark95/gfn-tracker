# GFN Tracker

A simple, self-contained web application for tracking your GeForce NOW (GFN) usage. This tool helps you manage your gaming hours, calculate daily usage budgets, and estimate your monthly costs. It's designed as a Progressive Web App (PWA), so you can save it to your home screen for easy access.

## Features

- **Track Remaining Hours:** Input your current GFN balance to see how much time you have left.
- **Daily Budget Calculation:** Set your subscription renewal date to automatically calculate a daily gaming budget.
- **Cost Estimation:** Factor in your plan (Performance or Ultimate) and any purchased top-up blocks to see your estimated monthly cost.
- **Rollover Exclusion:** Optionally exclude 15 rollover hours from your budget for more conservative planning.
- **PWA Support:** Install the app on your mobile device or desktop for an app-like experience.
- **Privacy-Focused:** All data is stored locally in your browser; nothing is sent to a server.

## Development

To run this application locally, you'll need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Skylark95/gfn-tracker.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd gfn-tracker
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start a local development server with Hot Module Replacement (HMR).

### Running with VS Code

If you are using Visual Studio Code, you can use the provided task to run the development server:

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Type `Tasks: Run Build Task`.
3.  Select `Run GFN Tracker (Dev)`.
4.  Vite will provide a local URL to open in your browser.

## Code Quality

This project uses ESLint for code linting and Prettier for code formatting to ensure consistent code style and identify potential issues early.

-   **Linting:** To check for code quality issues:
    ```bash
    npm run lint
    ```
-   **Formatting:** To automatically format your code:
    ```bash
    npm run format
    ```

## Technology Stack

- **Vite:** For the development server and build process.
- **React:** For the user interface and application logic.
- **TypeScript:** For type safety and improved developer experience.
- **Tailwind CSS:** For styling.
- **Lucide Icons:** For icons.
- **ESLint:** For code linting and identifying potential issues.
- **Prettier:** For consistent code formatting.

## Contributing

Contributions are welcome! If you have ideas for improvements or find any bugs, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
