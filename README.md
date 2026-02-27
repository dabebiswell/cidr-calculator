# CIDR Calculator

A fast, classless subnet calculation tool built with Vanilla TypeScript and Vite. It runs entirely client-side with no backend dependencies, designed to quickly help with routing, ACL wildcard masks, and subnet mathematics.

## Features
* **Real-time calculations**: Results update instantly as you type or drag the subnet mask slider.
* **Kanagawa Theme**: Features a responsive, Kanagawa-inspired dark mode UI.
* **One-Click Copy**: Easily copy calculated netmasks, wildcards, and address ranges to your clipboard.
* **100% Client-Side Math**: Built entirely from scratch in TypeScript with zero runtime dependencies.

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment
This project is pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically deploy to **GitHub Pages** anytime code is pushed to the `master` branch.

## License
[MIT](LICENSE.md)
