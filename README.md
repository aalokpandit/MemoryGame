# Memory Game

A feature-rich memory card matching game built with React and Vite.

## Features

### Game Modes
- **Single Player & Multiplayer**: Solo mode with timer, or multiplayer with turn-taking and player stats
- **Multiple Themes**: Choose from 4 different themes with 32 unique items each
  - Animals
  - Fruits & Vegetables
  - Vehicles & Transport
  - Everyday Objects

### Difficulty Levels
- **Easy**: 4×4 grid (8 pairs)
- **Medium**: 6×6 grid (18 pairs)
- **Hard**: 8×8 grid (32 pairs)

### Gameplay Features
- **Timer**: Tracks your completion time from first card flip to game completion
- **Dynamic Grid**: Automatically scales to fit your screen while maintaining square cards
- **Card Flip Animation**: Smooth 3D flip transitions
- **Emoji Card Faces**: 128 unique emojis across 4 themes; each card uses the theme color for the border and a complementary tinted background for contrast, plus layered drop-shadow for depth
- **Win Detection**: Automatically detects when all pairs are matched
- **Celebration**: Win screen with completion time and celebration emojis

### Multiplayer Mode
- **Players**: 2–4 players, capped by difficulty (max 2 on 4×4, 3 on 6×6, 4 on 8×8)
- **Names**: Each player has a unique name (max 10 chars) entered before starting; names are locked once play begins
- **Turn Logic**: A random player starts; matching keeps the turn, missing passes to the next player
- **Panels**: Four corner panels show active highlight, dim inactive players, and track matches plus matched item list
- **Winners**: Highest match count wins; ties are handled and reported; timer is shown on the end screen (hidden during multiplayer play)

## Recent Refactors & Optimizations

- **Lean App component**: Moved large constants and utilities out of `src/App.jsx`.
- **Stable win detection**: Effect now depends on `mode`, `players`, and `playerCount` to avoid stale winners.
- **Safer clicks**: Card click handler guards invalid indices and states.
- **Cleaner classes**: Centralized player panel classes via a helper.
- **Responsive board**: Card size recalculates on window resize for consistent layout.
- **Player clamping**: `playerCount` and active index auto-clamp when difficulty reduces max players.

### Technical Features
- Responsive design that fits any screen size
- Fisher-Yates shuffle algorithm for random card distribution
- Optimized React components with memo() for better performance
- Clean, modern UI with gradient backgrounds

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Play

1. Select your preferred difficulty level and theme
2. Click "Start Game" to begin
3. Click on cards to flip them and reveal the items
4. Match pairs of identical items
5. The timer starts when you flip your first card
6. Complete all pairs to win and see your time!
7. Click "Play Another Game" to try again with different settings

## Technologies Used

- React 19.2.0
- Vite 7.2.4
- CSS3 (Grid, Flexbox, Animations)
- Google Fonts (Roboto Mono)

## Project Structure

- `src/App.jsx`: Game logic, state management, and layout
- `src/components/Board.jsx` / `Card.jsx`: Grid and card rendering (memoized)
- `src/data/themes.js`: Theme definitions and colors
- `src/constants/difficulties.js`: Grid sizes and pair counts
- `src/utils/cards.js`: Card generation and shuffle utilities

## Development

Start a local dev server:

```powershell
cd c:\Projects\MemoryGame\memory-game
npm run dev -- --host --port 5173
```

If port 5173 is busy, Vite will pick another port and report it in the terminal.

## Emoji Compatibility & Testing

- All 128 emojis are verified in the browser for the current theme sets. If you switch browsers or platforms and see missing glyphs, open [public/emoji-test.html](public/emoji-test.html) to spot any unsupported emojis.
- Theme coverage (32 each): Animals; Fruits & Veggies; Vehicles; Objects. See [src/data/themes.js](src/data/themes.js) for the current mappings.
- If any emoji shows as a rectangle or question mark, replace it with an older, widely supported emoji and re-run the test page.

## License

This project is open source and available under the MIT License.
