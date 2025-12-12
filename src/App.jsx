import { useState, useEffect, useMemo } from 'react';
import Board from './components/Board';
import './App.css';

const THEMES = {
  animals: [
    { name: 'Dog', color: '#FF5733' },
    { name: 'Cat', color: '#33FF57' },
    { name: 'Cow', color: '#3357FF' },
    { name: 'Lion', color: '#FF33A1' },
    { name: 'Bear', color: '#F3FF33' },
    { name: 'Duck', color: '#A133FF' },
    { name: 'Panda', color: '#33FFA1' },
    { name: 'Tiger', color: '#FF9F33' },
    { name: 'Elephant', color: '#FF6B9D' },
    { name: 'Fox', color: '#C70039' },
    { name: 'Wolf', color: '#900C3F' },
    { name: 'Rabbit', color: '#581845' },
    { name: 'Deer', color: '#FFC300' },
    { name: 'Giraffe', color: '#DAF7A6' },
    { name: 'Zebra', color: '#33FFD5' },
    { name: 'Monkey', color: '#3385FF' },
    { name: 'Horse', color: '#8E44AD' },
    { name: 'Sheep', color: '#E74C3C' },
    { name: 'Goat', color: '#16A085' },
    { name: 'Pig', color: '#F39C12' },
    { name: 'Chicken', color: '#D35400' },
    { name: 'Eagle', color: '#7D3C98' },
    { name: 'Owl', color: '#2874A6' },
    { name: 'Penguin', color: '#148F77' },
    { name: 'Dolphin', color: '#D98880' },
    { name: 'Whale', color: '#C39BD3' },
    { name: 'Shark', color: '#76D7C4' },
    { name: 'Turtle', color: '#F8C471' },
    { name: 'Frog', color: '#82E0AA' },
    { name: 'Snake', color: '#AED6F1' },
    { name: 'Lizard', color: '#F9E79F' },
    { name: 'Butterfly', color: '#FADBD8' },
  ],
  fruits: [
    { name: 'Apple', color: '#FF0800' },
    { name: 'Banana', color: '#FFE135' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Grape', color: '#6F2DA8' },
    { name: 'Strawberry', color: '#FC5A8D' },
    { name: 'Watermelon', color: '#FC6C85' },
    { name: 'Pineapple', color: '#FDD017' },
    { name: 'Mango', color: '#FDBE02' },
    { name: 'Cherry', color: '#DE3163' },
    { name: 'Blueberry', color: '#4F86F7' },
    { name: 'Peach', color: '#FFE5B4' },
    { name: 'Pear', color: '#D1E231' },
    { name: 'Kiwi', color: '#8EE53F' },
    { name: 'Lemon', color: '#FFF44F' },
    { name: 'Lime', color: '#BFFF00' },
    { name: 'Coconut', color: '#8B4513' },
    { name: 'Papaya', color: '#FFEFD5' },
    { name: 'Avocado', color: '#568203' },
    { name: 'Tomato', color: '#FF6347' },
    { name: 'Carrot', color: '#ED9121' },
    { name: 'Broccoli', color: '#4E8B3D' },
    { name: 'Corn', color: '#FBEC5D' },
    { name: 'Cucumber', color: '#39FF14' },
    { name: 'Eggplant', color: '#614051' },
    { name: 'Lettuce', color: '#90EE90' },
    { name: 'Onion', color: '#E6E6FA' },
    { name: 'Pepper', color: '#FF033E' },
    { name: 'Potato', color: '#D2B48C' },
    { name: 'Pumpkin', color: '#FF7518' },
    { name: 'Radish', color: '#E30B5C' },
    { name: 'Spinach', color: '#097969' },
    { name: 'Zucchini', color: '#228B22' },
  ],
  vehicles: [
    { name: 'Car', color: '#FF0000' },
    { name: 'Bus', color: '#FFD700' },
    { name: 'Train', color: '#4169E1' },
    { name: 'Plane', color: '#87CEEB' },
    { name: 'Bike', color: '#32CD32' },
    { name: 'Truck', color: '#FF4500' },
    { name: 'Boat', color: '#1E90FF' },
    { name: 'Ship', color: '#000080' },
    { name: 'Helicopter', color: '#FF6347' },
    { name: 'Motorcycle', color: '#FF1493' },
    { name: 'Scooter', color: '#00CED1' },
    { name: 'Taxi', color: '#FFFF00' },
    { name: 'Ambulance', color: '#FF0000' },
    { name: 'FireTruck', color: '#DC143C' },
    { name: 'PoliceCar', color: '#0000FF' },
    { name: 'Van', color: '#708090' },
    { name: 'Subway', color: '#A9A9A9' },
    { name: 'Tram', color: '#FFB6C1' },
    { name: 'Yacht', color: '#FFFFFF' },
    { name: 'Canoe', color: '#8B4513' },
    { name: 'Jet', color: '#C0C0C0' },
    { name: 'Rocket', color: '#FF4500' },
    { name: 'Balloon', color: '#FF69B4' },
    { name: 'Parachute', color: '#00FFFF' },
    { name: 'Skateboard', color: '#FF8C00' },
    { name: 'Rollerblade', color: '#9370DB' },
    { name: 'Segway', color: '#20B2AA' },
    { name: 'Cart', color: '#DAA520' },
    { name: 'Wagon', color: '#CD853F' },
    { name: 'Sled', color: '#F0E68C' },
    { name: 'Snowmobile', color: '#E0FFFF' },
    { name: 'Hovercraft', color: '#B0C4DE' },
  ],
  objects: [
    { name: 'Book', color: '#8B4513' },
    { name: 'Pen', color: '#0000FF' },
    { name: 'Cup', color: '#FF69B4' },
    { name: 'Phone', color: '#000000' },
    { name: 'Laptop', color: '#C0C0C0' },
    { name: 'Watch', color: '#FFD700' },
    { name: 'Glasses', color: '#A0522D' },
    { name: 'Key', color: '#FFD700' },
    { name: 'Wallet', color: '#654321' },
    { name: 'Bag', color: '#FF6347' },
    { name: 'Shoe', color: '#1E90FF' },
    { name: 'Hat', color: '#FF4500' },
    { name: 'Clock', color: '#2F4F4F' },
    { name: 'Lamp', color: '#FFFFE0' },
    { name: 'Chair', color: '#8B4513' },
    { name: 'Table', color: '#D2691E' },
    { name: 'Mirror', color: '#E0E0E0' },
    { name: 'Picture', color: '#DAA520' },
    { name: 'Vase', color: '#4682B4' },
    { name: 'Pillow', color: '#FFF8DC' },
    { name: 'Blanket', color: '#CD853F' },
    { name: 'Candle', color: '#FFFACD' },
    { name: 'Plate', color: '#FFFFFF' },
    { name: 'Fork', color: '#C0C0C0' },
    { name: 'Spoon', color: '#C0C0C0' },
    { name: 'Knife', color: '#808080' },
    { name: 'Bowl', color: '#ADD8E6' },
    { name: 'Bottle', color: '#00FF00' },
    { name: 'Scissors', color: '#FF0000' },
    { name: 'Tape', color: '#FFFF00' },
    { name: 'Stapler', color: '#000000' },
    { name: 'Notebook', color: '#87CEEB' },
  ],
};

const DIFFICULTIES = {
  easy: { size: 4, pairs: 8 },
  medium: { size: 6, pairs: 18 },
  hard: { size: 8, pairs: 32 },
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateCards(theme, pairsCount) {
  const themeItems = THEMES[theme];
  const shuffledItems = shuffle([...themeItems]);
  const selectedItems = shuffledItems.slice(0, pairsCount);
  
  const cards = [];
  let id = 1;
  for (const item of selectedItems) {
    cards.push({ id: id++, value: item.name, color: item.color, isFlipped: false, isMatched: false });
    cards.push({ id: id++, value: item.name, color: item.color, isFlipped: false, isMatched: false });
  }
  return shuffle(cards);
}

function App() {
  const [mode, setMode] = useState('single'); // 'single' | 'multi'
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('animals');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isBoardLocked, setIsBoardLocked] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [banner, setBanner] = useState(null); // { text: string } | null
  const [panelEffect, setPanelEffect] = useState(null); // { index:number, type:'match'|'miss' } | null
  const [winners, setWinners] = useState([]); // multiplayer winners at end

  // Multiplayer state scaffolding
  const gridSide = useMemo(() => DIFFICULTIES[difficulty].size, [difficulty]);
  const maxPlayers = useMemo(() => Math.max(2, Math.floor(gridSide / 2)), [gridSide]);
  const [playerCount, setPlayerCount] = useState(2);
  const playerColors = ['#FF6B6B', '#4ECDC4', '#C7F464', '#C44DFF'];
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', color: playerColors[0], matches: 0, matchedItems: [] },
    { id: 2, name: 'Player 2', color: playerColors[1], matches: 0, matchedItems: [] },
    { id: 3, name: 'Player 3', color: playerColors[2], matches: 0, matchedItems: [] },
    { id: 4, name: 'Player 4', color: playerColors[3], matches: 0, matchedItems: [] },
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [isPlayersLocked, setIsPlayersLocked] = useState(false);

  // Timer runs always during a game, but we only display in single mode
  useEffect(() => {
    if (!isGameStarted || isGameWon) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon]);

  useEffect(() => {
    if (!isGameStarted) {
      setSeconds(0);
    }
  }, [isGameStarted]);

  useEffect(() => {
    if (!gameInitialized || cards.length === 0) return;
    if (!cards.every(card => card.isMatched)) return;

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const time = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    setCompletionTime(time);
    setIsGameWon(true);

    if (mode === 'multi') {
      const activePlayers = players.slice(0, playerCount);
      const maxMatches = Math.max(...activePlayers.map(p => p.matches));
      const w = activePlayers.filter(p => p.matches === maxMatches).map(p => p.name);
      setWinners(w);
    }
  }, [cards, gameInitialized, seconds, mode, players, playerCount]);

  useEffect(() => {
    if (flippedCards.length !== 2) return;

    setIsBoardLocked(true);
    const [first, second] = flippedCards;
    const firstCard = cards[first];
    const secondCard = cards[second];
    if (!firstCard || !secondCard) {
      setFlippedCards([]);
      setIsBoardLocked(false);
      return;
    }

    if (firstCard.value === secondCard.value) {
      setCards(prev => prev.map((card, idx) => {
        if (idx === first || idx === second) {
          return { ...card, isMatched: true, isFlipped: false };
        }
        return card;
      }));

      if (mode === 'multi') {
        const matchedName = firstCard.value;
        const currentName = players[activePlayerIndex]?.name || `Player ${activePlayerIndex + 1}`;
        setPlayers(prev => {
          const next = [...prev];
          next[activePlayerIndex] = {
            ...next[activePlayerIndex],
            matches: next[activePlayerIndex].matches + 1,
            matchedItems: [...next[activePlayerIndex].matchedItems, matchedName],
          };
          return next;
        });
        setBanner({ text: `${currentName} matched ${matchedName}! Goes again.` });
        setTimeout(() => setBanner(null), 1200);
        setPanelEffect({ index: activePlayerIndex, type: 'match' });
        setTimeout(() => setPanelEffect(null), 500);
      }

      setFlippedCards([]);
      setIsBoardLocked(false);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map((card, idx) => {
          if (idx === first || idx === second) {
            return { ...card, isFlipped: false };
          }
          return card;
        }));
        setFlippedCards([]);
        setIsBoardLocked(false);
        if (mode === 'multi') {
          const nextIndex = (activePlayerIndex + 1) % playerCount;
          const nextName = players[nextIndex]?.name || `Player ${nextIndex + 1}`;
          setPanelEffect({ index: activePlayerIndex, type: 'miss' });
          setTimeout(() => setPanelEffect(null), 500);
          setActivePlayerIndex(nextIndex);
          setBanner({ text: `${nextName}'s turn.` });
          setTimeout(() => setBanner(null), 1200);
        }
      }, 1000);
    }
  }, [flippedCards, cards, mode, activePlayerIndex, playerCount, players]);

  const handleCardClick = (clickedIndex) => {
    const card = cards[clickedIndex];
    if (!card) return; // guard stale indices
    if (isBoardLocked || flippedCards.length === 2 || card.isFlipped || card.isMatched) {
      return;
    }

    if (!isGameStarted) {
      setIsGameStarted(true);
    }

    const newCards = cards.map((card, index) => {
      if (index === clickedIndex) {
        return { ...card, isFlipped: true };
      }
      return card;
    });
    setCards(newCards);

    setFlippedCards(prev => [...prev, clickedIndex]);
  };

  const startGame = () => {
    const pairsCount = DIFFICULTIES[difficulty].pairs;
    setCards(generateCards(theme, pairsCount));
    setGameInitialized(true);
    setFlippedCards([]);
    setIsBoardLocked(false);
    setIsGameWon(false);
    setIsGameStarted(mode === 'multi' ? true : false);
    setCompletionTime(0);
    setSeconds(0);
    if (mode === 'multi') {
      setIsPlayersLocked(true);
      const first = Math.floor(Math.random() * playerCount);
      setActivePlayerIndex(first);
      const firstName = players[first]?.name || `Player ${first + 1}`;
      setBanner({ text: `${firstName} starts!` });
    } else {
      setIsPlayersLocked(false);
    }
  };

  const resetGame = () => {
    setGameInitialized(false);
    setCards([]);
    setFlippedCards([]);
    setIsBoardLocked(false);
    setIsGameWon(false);
    setIsGameStarted(false);
    setCompletionTime(0);
    setSeconds(0);
    setIsPlayersLocked(false);
    setPlayers(prev => prev.map((p, i) => ({
      id: i + 1,
      name: p.name,
      color: p.color,
      matches: 0,
      matchedItems: [],
    })));
    setActivePlayerIndex(0);
  };

  const gridSize = DIFFICULTIES[difficulty].size;
  const actionLabel = !gameInitialized ? 'Start Game' : isGameWon ? 'Play Another Game' : 'Reset';
  const actionHandler = !gameInitialized ? startGame : (isGameWon ? resetGame : resetGame);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const getPanelClass = (idx) => {
    const isActivePlayer = idx === activePlayerIndex && idx < playerCount && gameInitialized;
    const isDimmedTurn = idx < playerCount && gameInitialized && idx !== activePlayerIndex;
    const isPreStartDim = idx < playerCount && !gameInitialized;
    const isMatchEffect = panelEffect && panelEffect.index === idx && panelEffect.type === 'match';
    const isMissEffect = panelEffect && panelEffect.index === idx && panelEffect.type === 'miss';

    return [
      'player-panel',
      idx < playerCount ? 'panel-active' : 'panel-inactive',
      isActivePlayer ? 'active' : '',
      isDimmedTurn ? 'dimmed' : '',
      isPreStartDim ? 'dimmed' : '',
      isMatchEffect ? 'pulse-match' : '',
      isMissEffect ? 'tint-miss' : '',
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <div className="top-controls">
        <div className="control-select">
          <label>Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={isGameStarted}>
            <option value="single">Single Player</option>
            <option value="multi">Multi Player</option>
          </select>
        </div>
        <div className="control-select">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={gameInitialized}>
            <option value="easy">Easy (4x4)</option>
            <option value="medium">Medium (6x6)</option>
            <option value="hard">Hard (8x8)</option>
          </select>
        </div>
        <div className="control-select">
          <label>Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} disabled={gameInitialized}>
            <option value="animals">Animals</option>
            <option value="fruits">Fruits & Vegetables</option>
            <option value="vehicles">Vehicles & Transport</option>
            <option value="objects">Everyday Objects</option>
          </select>
        </div>
        {mode === 'single' ? (
          <div className="control-select">
            <label>Time:</label>
            <div className="timer-display">{formattedTime}</div>
          </div>
        ) : (
          <div className="control-select">
            <label>Players:</label>
            <input type="number" min={2} max={maxPlayers} value={playerCount} onChange={(e) => setPlayerCount(Math.min(Math.max(Number(e.target.value), 2), maxPlayers))} disabled={gameInitialized} />
            <div className="helper-text">Max {maxPlayers} for {gridSide}×{gridSide}</div>
          </div>
        )}
        <div className="control-select">
          <label>&nbsp;</label>
          <button onClick={actionHandler} className="action-button">{actionLabel}</button>
        </div>
      </div>
      <div className="board-container">
        {mode === 'multi' && (
          <div className="players-corners">
            {players.map((p, idx) => (
              <div key={p.id} className={`player-wrapper corner-${idx} ${idx < playerCount ? 'wrapper-active' : 'wrapper-inactive'}`}>
                <input
                  className="player-name-input"
                  value={p.name}
                  maxLength={10}
                  onChange={(e) => {
                    if (isPlayersLocked || idx >= playerCount) return;
                    const newName = e.target.value;
                    // Enforce unique names (case-insensitive)
                    setPlayers(prev => {
                      const next = [...prev];
                      const exists = next.some((pl, i) => i !== idx && pl.name.toLowerCase() === newName.toLowerCase());
                      next[idx] = { ...next[idx], name: exists ? next[idx].name : newName };
                      return next;
                    });
                  }}
                  disabled={isPlayersLocked || idx >= playerCount}
                  style={{ borderColor: p.color }}
                />
                <div
                  className={getPanelClass(idx)}
                  style={{ borderColor: p.color, '--panel-color': p.color }}
                >
                  <div className="player-stats">
                  <span className="matches-count">Matches: {p.matches}</span>
                </div>
                <div className="matched-list">
                  {p.matchedItems.map((m) => (
                    <div key={m} className="matched-item">{m}</div>
                  ))}
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {gameInitialized && <Board cards={cards} onCardClick={handleCardClick} gridSize={gridSize} />}
        {banner && (
          <div className="inline-banner" role="status" aria-live="polite">{banner.text}</div>
        )}
        {isGameWon && (
          <div className="win-overlay">
            <div className="win-screen">
              {mode === 'single' ? (
                <h2>🎉 Congrats! You completed the game in {completionTime} 🎉</h2>
              ) : (
                <>
                  <h2>🎉 Game Over 🎉</h2>
                  <p>Total Time: {completionTime}</p>
                  {winners.length > 1 ? (
                    <p>Winners: {winners.join(', ')}</p>
                  ) : (
                    <p>Winner: {winners[0]}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
