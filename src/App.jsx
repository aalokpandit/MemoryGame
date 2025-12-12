import { useState, useEffect, useMemo } from 'react';
import Board from './components/Board';
import { THEMES } from './data/themes';
import { DIFFICULTIES } from './constants/difficulties';
import { generateCards } from './utils/cards';
import './App.css';

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
