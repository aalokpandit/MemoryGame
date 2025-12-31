import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import MenuScreen from './components/MenuScreen';
import Board from './components/Board';
import PlayerBar from './components/PlayerBar';
import { THEMES } from './data/themes';
import { DIFFICULTIES } from './constants/difficulties';
import { generateCards } from './utils/cards';
import './App.css';

function App() {
  // Screen management
  const [screen, setScreen] = useState('menu'); // 'menu' | 'game'

  // Theme management (light | dark | auto)
  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem('colorTheme') || 'auto';
  });

  // Game configuration (set by menu)
  const [mode, setMode] = useState('single'); // 'single' | 'multi'
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('animals');
  // Game state
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isBoardLocked, setIsBoardLocked] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [moves, setMoves] = useState(0); // Moves counter (one pair attempt = one move)
  const [banner, setBanner] = useState(null); // { text: string } | null
  const [panelEffect, setPanelEffect] = useState(null); // { index:number, type:'match'|'miss' } | null
  const [winners, setWinners] = useState([]); // multiplayer winners at end
  const boardAreaRef = useRef(null);
  const [boardArea, setBoardArea] = useState({ width: 0, height: 0 });

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

  // When difficulty changes, clamp playerCount and active index within range
  useEffect(() => {
    if (playerCount > maxPlayers) {
      setPlayerCount(maxPlayers);
    }
    if (activePlayerIndex >= maxPlayers) {
      setActivePlayerIndex(0);
    }
  }, [maxPlayers]);

  // Apply theme to document and persist to localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (colorTheme === 'auto') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', colorTheme);
    }
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setColorTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  // Track board area so the grid can size to the actual container instead of the viewport
  useLayoutEffect(() => {
    if (screen !== 'game') return;
    if (!boardAreaRef.current) return;

    const measure = () => {
      const rect = boardAreaRef.current?.getBoundingClientRect();
      const width = Math.max(0, Math.floor(rect?.width ?? 0));
      const height = Math.max(0, Math.floor(rect?.height ?? 0));

      // Fallback to viewport if something reports zero (some mobile browsers do this briefly)
      const fallbackWidth = Math.floor(window.innerWidth || 0);
      const fallbackHeight = Math.floor(window.innerHeight || 0);

      const next = {
        width: width || fallbackWidth,
        height: height || fallbackHeight,
      };

      setBoardArea((prev) => {
        const changed = prev.width !== next.width || prev.height !== next.height;
        return changed ? next : prev;
      });
    };

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(boardAreaRef.current);

    window.addEventListener('resize', measure);
    const rafId = requestAnimationFrame(measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(rafId);
    };
  }, [screen]);

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
    // Increment moves counter (one pair attempt = one move)
    setMoves(prev => prev + 1);

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

  // Handle menu start game
  const handleStartGame = (config) => {
    setMode(config.mode);
    setDifficulty(config.difficulty);
    setTheme(config.theme);

    // Set player count and names if multiplayer
    if (config.mode === 'multi') {
      setPlayerCount(config.playerCount);
      setPlayers(prev => prev.map((p, i) => ({
        ...p,
        name: config.playerNames[i] || p.name,
      })));
    }

    setScreen('game');
    // Start immediately using provided config to avoid stale state
    startGame(config);
  };

  const startGame = (cfg) => {
    const d = cfg?.difficulty ?? difficulty;
    const t = cfg?.theme ?? theme;
    const m = cfg?.mode ?? mode;
    const pairsCount = DIFFICULTIES[d].pairs;
    setCards(generateCards(t, pairsCount));
    setGameInitialized(true);
    setFlippedCards([]);
    setIsBoardLocked(false);
    setIsGameWon(false);
    setIsGameStarted(m === 'multi' ? true : false);
    setCompletionTime(0);
    setSeconds(0);
    setMoves(0);
    if (m === 'multi') {
      setIsPlayersLocked(true);
      // Use config values to ensure we have the correct player count and names
      const pCount = cfg?.playerCount ?? playerCount;
      const pNames = cfg?.playerNames ?? players.map(p => p.name);
      const first = Math.floor(Math.random() * pCount);
      setActivePlayerIndex(first);
      const firstName = pNames[first] || `Player ${first + 1}`;
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
    setMoves(0);
    setIsPlayersLocked(false);
    setBanner(null);
    setPlayers(prev => prev.map((p, i) => ({
      id: i + 1,
      name: p.name,
      color: p.color,
      matches: 0,
      matchedItems: [],
    })));
    setActivePlayerIndex(0);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleBackToMenu = () => {
    if (gameInitialized && !isGameWon) {
      setShowConfirmDialog(true);
    } else {
      resetGame();
      setScreen('menu');
    }
  };

  const confirmBackToMenu = () => {
    setShowConfirmDialog(false);
    resetGame();
    setScreen('menu');
  };

  const cancelBackToMenu = () => {
    setShowConfirmDialog(false);
  };

  const handleRestartSame = () => {
    // Restart with current selections
    resetGame();
    startGame({ mode, difficulty, theme });
  };

  const gridSize = DIFFICULTIES[difficulty].size;

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

  if (screen === 'menu') {
    return (
      <MenuScreen 
        onStartGame={handleStartGame}
        colorTheme={colorTheme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Memory Game</h1>
        <div className="header-actions">
          <button className="back-button" onClick={handleBackToMenu}>← Back to Menu</button>
          <button className="back-button" onClick={handleRestartSame}>↻ Restart</button>
        </div>
      </div>
      
      {mode === 'multi' && playerCount > 0 && (
        <PlayerBar 
          players={players}
          playerCount={playerCount}
          activePlayerIndex={activePlayerIndex}
        />
      )}
      
      {mode === 'single' && (
        <div className="single-player-info">
          <div className="info-item">
            <span className="label">Moves:</span>
            <span className="value">{moves}</span>
          </div>
          <div className="info-item">
            <span className="label">Time:</span>
            <span className="value">{formattedTime}</span>
          </div>
        </div>
      )}

      <div className="board-container">
        <div className="board-area" ref={boardAreaRef}>
          {gameInitialized && (
            <Board
              cards={cards}
              onCardClick={handleCardClick}
              gridSize={gridSize}
              boardArea={boardArea}
            />
          )}
        </div>

        {banner && (
          <div className="inline-banner" role="status" aria-live="polite">{banner.text}</div>
        )}
        {showConfirmDialog && (
          <div className="win-overlay">
            <div className="win-screen confirm-dialog">
              <h2>Abandon Game?</h2>
              <p>Game in progress. Are you sure you want to go back to the menu?</p>
              <div className="dialog-buttons">
                <button onClick={confirmBackToMenu} className="confirm-button">Yes, Go to Menu</button>
                <button onClick={cancelBackToMenu} className="cancel-button">Cancel</button>
              </div>
            </div>
          </div>
        )}
        {isGameWon && (
          <div className="win-overlay">
            <div className="win-screen">
              {mode === 'single' ? (
                <>
                  <h2>🎉 Congrats! You completed the game in {completionTime} and {moves} moves🎉</h2>
                </>
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
              <div className="win-buttons">
                <button onClick={handleRestartSame} className="play-again-button">Play Again</button>
                <button onClick={() => {
                  resetGame();
                  setScreen('menu');
                }} className="menu-button">Back to Menu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
