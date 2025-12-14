# Memory Game

A fully responsive, feature-rich memory card matching game built with React and Vite. Optimized for mobile and desktop with adaptive layouts and dynamic sizing.

## Features

### Game Modes
- **Single Player**: Solo play with move counter and timer
- **Multiplayer**: 2–4 players with turn-taking, color-coded panels, and match tracking

### Themes
Choose from 4 unique themes with 32 emojis each:
- **Animals** 🐶
- **Fruits & Vegetables** 🍎
- **Vehicles & Transportation** 🚗
- **Everyday Objects** 📚

### Difficulty Levels
- **Easy**: 4×4 grid (8 pairs)
- **Medium**: 6×6 grid (18 pairs)
- **Hard**: 8×8 grid (32 pairs)

Visual indicators: difficulty cards show scaled emoji icons (small for Easy, large for Hard) to represent relative game size.

### Gameplay Features
- **Adaptive Grid**: Cards scale dynamically based on available screen space with intelligent gap distribution
- **Mobile Optimized**: 8×8 grid fits on mobile screens (portrait and landscape) without scrolling
- **Move Counter**: Tracks pair attempts (one flip = one move)
- **Timer**: Starts on first card flip and runs until game completion
- **Card Animations**: Smooth 3D flip transitions with color-coded borders and layered drop-shadows
- **Win Screen**: Shows completion stats with "Play Again" (restart same config) and "Back to Menu" buttons
- **Custom Confirmation Dialog**: Styled confirmation when abandoning an active game (no confirmation after game completion)

### Multiplayer Features
- **2–4 Players**: Player count capped by difficulty (max 2 on Easy, 3 on Medium, 4 on Hard)
- **Custom Names**: Each player enters a name (up to 12 characters) before starting
- **Turn System**: Random starting player; matching keeps turn, missing passes to next
- **Player Panels**: Color-coded panels show current player, match counts, and matched items (expandable)
- **Winner Detection**: Highest match count wins; handles ties and displays all winners

## Mobile Optimization

The game automatically measures available screen space and:
- Shrinks cards as needed (down to 2px minimum) to fit dense grids
- Adds breathing room between cards when space permits (dynamic gap calculation)
- Centers the grid vertically and horizontally
- Compresses header, buttons, and player info on short screens
- Eliminates horizontal/vertical scrolling during gameplay

Menu screen scales all components to fit viewport without scrolling.

## Recent Updates

### Mobile Layout (v2.0)
- Accurate board measurement via `getBoundingClientRect` with viewport fallback
- Dynamic gap calculation distributes leftover space evenly between cards
- Grid centers on screen for better visual balance
- Flex containers with proper `min-height`/`min-width` guards for correct shrinking
- Menu screen scales padding/fonts/gaps to eliminate scrolling

### UX Improvements
- Play Again button restarts current game instead of returning to menu
- Separate "Back to Menu" button on win screen
- Custom styled confirmation dialog replaces browser's `confirm()`
- No confirmation prompt when returning to menu after game completion
- Difficulty cards show visually scaled icons matching grid size

### Code Quality
- Moved large constants and utilities out of main component
- Stable win detection with proper dependency tracking
- Safer card click handling with guard conditions
- Centralized player panel CSS classes
- Optimized re-renders with React.memo() and proper effect dependencies

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

For mobile testing with network access:

```bash
npm run dev -- --host
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

### Single Player
1. Choose difficulty level and theme from the menu
2. Click "Start Game"
3. Flip cards by clicking to find matching pairs
4. Timer starts on first flip
5. Complete all pairs to see your time and move count
6. Click "Play Again" to restart or "Back to Menu" to change settings

### Multiplayer
1. Select "Multiplayer" mode
2. Choose number of players (2–4, based on difficulty)
3. Enter player names
4. Select difficulty and theme
5. Click "Start Game" - a random player starts
6. Match pairs to keep your turn; miss to pass
7. Player with most matches wins!

## Technologies

- **React** 19.2.0 - UI library with hooks and memo optimization
- **Vite** 7.2.4 - Fast build tool and dev server
- **CSS3** - Grid, Flexbox, container queries, animations, and responsive design
- **Google Fonts** - Roboto Mono for timer/counter display

## Project Structure

```
src/
├── App.jsx                    # Main game logic and state
├── App.css                    # Game screen styles
├── main.jsx                   # React entry point
├── components/
│   ├── MenuScreen.jsx         # Menu UI and configuration
│   ├── Board.jsx              # Dynamic grid layout with measured sizing
│   ├── Card.jsx               # Card flip component
│   └── PlayerBar.jsx          # Multiplayer panel display
├── styles/
│   ├── MenuScreen.css         # Menu responsive styles
│   └── PlayerBar.css          # Player panel styles
├── data/
│   └── themes.js              # Theme emoji sets and colors
├── constants/
│   └── difficulties.js        # Grid sizes and pair counts
└── utils/
    └── cards.js               # Card generation and Fisher-Yates shuffle
```

## Browser Support

- Modern browsers with ES6+ support
- Tested on Chrome, Firefox, Safari, Edge
- Mobile browsers: iOS Safari, Chrome Mobile, Samsung Internet
- Uses `100dvh` for accurate mobile viewport height

## License

MIT

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
