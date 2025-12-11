# Memory Game

A feature-rich memory card matching game built with React and Vite.

## Features

### Game Modes
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
- **Colored Cards**: Each item has its own unique color with contrasting text for readability
- **Win Detection**: Automatically detects when all pairs are matched
- **Celebration**: Win screen with completion time and celebration emojis

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

## License

This project is open source and available under the MIT License.
