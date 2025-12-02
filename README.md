# GFN Tracker

A simple, self-contained web application for tracking your GeForce NOW (GFN) usage. This tool helps you manage your gaming hours, calculate daily usage budgets, and estimate your monthly costs. It's designed as a Progressive Web App (PWA), so you can save it to your home screen for easy access.

## Features

*   **Track Remaining Hours:** Input your current GFN balance to see how much time you have left.
*   **Daily Budget Calculation:** Set your subscription renewal date to automatically calculate a daily gaming budget.
*   **Cost Estimation:**  Factor in your plan (Performance or Ultimate) and any purchased top-up blocks to see your estimated monthly cost.
*   **Rollover Exclusion:**  Optionally exclude 15 rollover hours from your budget for more conservative planning.
*   **PWA Support:** Install the app on your mobile device or desktop for an app-like experience.
*   **Privacy-Focused:** All data is stored locally in your browser; nothing is sent to a server.

## Development

To run this application locally, you'll need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gfn-tracker.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd gfn-tracker
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Build the application:**
    ```bash
    npm run build
    ```
5.  **Open the `index.html` file in your web browser.**


### Running with VS Code

If you are using Visual Studio Code, you can use the provided task to run a local server:

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Type `Tasks: Run Build Task`.
3.  Select `Run GFN Tracker`.
4.  Open your browser and navigate to `http://localhost:8000`.

## Technology Stack

*   **React:** For the user interface and application logic.
*   **Tailwind CSS:** For styling.
*   **Lucide Icons:** For icons.
*   **Babel:** For JavaScript transpilation.

## Contributing

Contributions are welcome! If you have ideas for improvements or find any bugs, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
