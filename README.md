# Stacky

A polished, local-first note-taking app built with Angular. Your notes live in your browser, so your data stays yours.

**Live demo:** [stacky-tan.vercel.app](https://stacky-tan.vercel.app)

---

## Overview

Stacky is a fast, distraction-free notes app that takes a **local-storage-first** approach to privacy. Notes are stored on your device rather than sent to a server, so there is no account to create and no backend holding your data.

## Features

<!-- Edit this list to match what's actually shipped -->

- 📝 Create, edit, and delete notes
- 🔒 Local-storage-first persistence: your data never leaves your browser
- ⚡ Fast, responsive UI built on modern Angular
- 🎨 Clean, polished interface
- 🚀 Zero-config deploys on Vercel

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | [Angular](https://angular.dev) 22 |
| Language | TypeScript 6 |
| Reactivity | RxJS 7.8 |
| Testing | [Vitest](https://vitest.dev) + jsdom |
| Formatting | Prettier |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (current LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Ayan-css/Stacky.git
cd Stacky
npm install
```

### Run the dev server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app reloads automatically when you change source files.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the dev server (`ng serve`) |
| `npm run build` | Production build into `dist/` |
| `npm run watch` | Rebuild on change (development config) |
| `npm test` | Run unit tests with Vitest |

## Project Structure

```
Stacky/
├── public/            # Static assets
├── src/               # Application source
├── angular.json       # Angular workspace config
├── vercel.json        # Vercel deployment config
├── tsconfig*.json     # TypeScript configs
└── package.json
```

## Data & Privacy

Stacky stores notes in the browser's local storage:

- No sign-up, no server, no tracking of your notes
- Data persists per browser and device
- Clearing site data in your browser will erase your notes, so back up anything important

## Deployment

The app is configured for [Vercel](https://vercel.com). Connect the repository and Vercel will pick up `vercel.json` and build with `ng build`.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

## License

No license has been specified yet. Add a `LICENSE` file (for example, MIT) to clarify usage.

---

Built by [Ayan](https://github.com/Ayan-css)
