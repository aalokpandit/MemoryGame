# Memory Game

A responsive emoji memory card matching game built with React and Vite, deployed at [memorygame.aalokdeep.com](https://memorygame.aalokdeep.com). Supports Single Player and 2–4 player local Multiplayer across desktop and mobile viewports.

## Features

### Game Modes
- **Single Player**: Solo play with a move counter and elapsed timer.
- **Multiplayer**: 2–4 local players with custom names, color-coded player panels, turn tracking, and winner/tie detection.

### Themes
4 themes with 32 emojis each (128 total, defined in `src/data/themes.js`):
- **Animals** 🐶
- **Fruits & Vegetables** 🍎
- **Vehicles & Transportation** 🚗
- **Everyday Objects** 📚 *(displayed as `EverydayObjects` in the menu UI)*

### Difficulty Levels
- **Easy**: 4×4 grid (8 pairs)
- **Medium**: 6×6 grid (18 pairs)
- **Hard**: 8×8 grid (32 pairs)

Difficulty cards render scaled `⊞` (`U+229E`) box symbols representing grid size.

### Gameplay & UI Details
- **Adaptive Grid Sizing**: Uses `ResizeObserver`, `window.resize`, and `requestAnimationFrame` on `.board-area` (with viewport fallbacks) to dynamically calculate card sizes (down to `2px`, fallback `80px`) and extra gap distribution (`baseGap` + up to `+2.5px`) so even `8×8` fits without page scrolling.
- **Move Counter**: One move = one pair attempt (`2` card flips). Moves are tracked internally in both modes and displayed only in Single Player.
- **Timer**:
  - **Single Player**: Starts on the first card flip and ticks every second until all pairs match.
  - **Multiplayer**: Starts immediately when the game begins; hidden during play and shown on the Game Over modal as `Total Time: MM:SS`.
- **Header Controls**: `← Back to Menu` shows a custom styled confirmation dialog while a game is in progress (skipped after completion). `↻ Restart` restarts immediately with the same settings without a confirmation prompt.
- **Theme Toggle**: Menu-only header button cycling `auto` (system preference) → `light` → `dark`, persisted in `localStorage['colorTheme']` via `data-theme` on `<html>`.
- **Menu Persistence**: `MenuScreen` persists `mode`, `difficulty`, `theme`, `playerCount`, and `playerNames` in `sessionStorage`.
- **Multiplayer Rules**:
  - Selecting `3` players disables **Easy** (bumping to Medium); selecting `4` players disables **Easy** and **Medium** (bumping to Hard).
  - Random starting player; matching keeps the turn and adds the matched card's text name (e.g., `"Dog"`) to the player's expandable panel; missing locks the board for `1000ms` and passes the turn.
  - Highest match count wins (handles multi-way ties).

## Getting Started

### Prerequisites
- Node.js (CI uses Node `20`) and `npm`

### Commands (Run from `c:\Projects\MemoryGame`)

```bash
npm install               # Install dependencies
npm run dev               # Start Vite dev server
npm run dev -- --host     # Expose dev server on LAN for mobile testing
npm run build             # Production build into dist/
npm run preview           # Preview dist/ locally
npm run lint              # Run ESLint (eslint .)
```

## Tech Stack & Project Structure

- **UI:** React `^19.2.0`, Vite `^7.2.4`, plain CSS3 (Flexbox, Grid, `100dvh`, `container-type: size` / `60cqw`, `color-mix()`), Google Fonts `Roboto Mono` (imported in `src/App.css`)
- **Linting:** ESLint `^9.39.1` (`eslint.config.js` with `eslint-plugin-react-hooks` `^7.0.1` & `eslint-plugin-react-refresh`)

```text
MemoryGame/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── public/
│   ├── favicon.png
│   └── emoji-test.html         # Static 128-emoji verification page (served at /emoji-test.html)
├── src/
│   ├── main.jsx
│   ├── App.jsx / App.css       # Core game state, ResizeObserver sizing, timer, modals
│   ├── components/
│   │   ├── MenuScreen.jsx      # Menu config + sessionStorage persistence + theme toggle
│   │   ├── Board.jsx           # CSS Grid board
│   │   ├── Card.jsx            # 3D flip card with inverted-RGB tint border
│   │   ├── PlayerBar.jsx       # Expandable multiplayer panels
│   │   ├── Confetti.jsx        # Unused legacy component
│   │   └── Timer.jsx           # Unused legacy component (logic lives in App.jsx)
│   ├── constants/difficulties.js
│   ├── data/themes.js
│   ├── styles/                 # MenuScreen.css, PlayerBar.css
│   └── utils/cards.js          # Card generation & Fisher-Yates shuffle
└── .github/
    ├── dependabot.yml          # Weekly security updates (open-pull-requests-limit: 0)
    └── workflows/
        └── azure-static-web-apps-gray-dune-042910710.yml
```

## CI/CD & Deployment

- **Azure Static Web Apps:** `.github/workflows/azure-static-web-apps-gray-dune-042910710.yml` builds with `npm run build` on Node `20` and deploys `dist/` (`skip_deploy_on_missing_secrets: true`).
- **PR Previews:** Pull requests run the SWA workflow (skipping deployment when secrets are absent) and close preview slots when PRs close. Note: CI does not run `npm run lint` or tests (no test suite is configured).
- **Dependabot:** `.github/dependabot.yml` sets `open-pull-requests-limit: 0` so only security updates open PRs.

## Emoji Compatibility & `public/emoji-test.html`

- `public/emoji-test.html` lists all 128 emojis across the 4 themes for cross-platform glyph verification. Because it resides in `public/`, Vite copies it into `dist/` and it is publicly accessible at `/emoji-test.html`.
- It is maintained manually alongside `src/data/themes.js` — any emoji edits in `themes.js` should be mirrored in `public/emoji-test.html`.

## Implementation Notes & Known Quirks

- **Difficulty lock leak from Multiplayer:** `MenuScreen.jsx`'s `isDifficultyDisabled()` checks `playerCount` without checking `mode === 'multi'`, so choosing 3–4 players in Multiplayer leaves lower difficulties disabled if you switch back to Single Player in the same session.
- **Initial Multiplayer Banner:** The `"<Name> starts!"` banner has no auto-dismiss timeout and remains visible (`pointer-events: none`) until the first pair attempt triggers a `1200ms` timed banner.
- **Uncleaned Timeouts:** Mismatch (`1000ms`) and banner (`1200ms`) timeouts in `App.jsx` are not cleared if `Restart` or `Back to Menu` is clicked mid-turn.
- **Dead Code & CSS Overlap:** `Confetti.jsx`, `Timer.jsx`, `panelEffect`/`getPanelClass`/`isPlayersLocked` in `App.jsx`, and unused classes in `App.css` remain in the repo. `.player-name-input` is defined in both `App.css` and `MenuScreen.css`.
- **Accessibility & Lint Baseline:** Cards render as clickable `<div>` elements without `role="button"`/`tabIndex`/keyboard handlers, modals lack `role="dialog"`/`Escape` handling, and `npm run lint` currently reports `eslint-plugin-react-hooks` v7 errors (`set-state-in-effect`, unused vars, and `Confetti.jsx` syntax).
- **License:** No `LICENSE` file or `"license"` field in `package.json` is currently present in the repository.
