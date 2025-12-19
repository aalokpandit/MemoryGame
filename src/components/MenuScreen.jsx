import { useState, useEffect } from 'react';
import { THEMES } from '../data/themes';
import { DIFFICULTIES } from '../constants/difficulties';
import '../styles/MenuScreen.css';

function MenuScreen({ onStartGame, colorTheme = 'auto', onToggleTheme }) {
  const [mode, setMode] = useState('single');
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('animals');
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);

  const handleStartGame = () => {
    onStartGame({ mode, difficulty, theme, playerCount, playerNames });
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const themeIcons = {
    animals: '🐶',
    fruits: '🍎',
    vehicles: '🚗',
    objects: '📚',
  };

  const themeNames = {
    animals: 'Animals',
    fruits: 'Fruits & Vegetables',
    vehicles: 'Vehicles & Transportation',
    objects: 'EverydayObjects',
  };

  // Enforce allowed difficulties based on player count
  const isDifficultyDisabled = (key) => {
    if (playerCount === 2) return false;
    if (playerCount === 3) return key === 'easy';
    if (playerCount === 4) return key !== 'hard';
    return false;
  };

  useEffect(() => {
    // Auto-adjust difficulty when current selection becomes invalid
    if (isDifficultyDisabled(difficulty)) {
      setDifficulty(playerCount === 3 ? 'medium' : 'hard');
    }
  }, [playerCount]);

  return (
    <div className="menu-screen">
      <div className="menu-header">
        <h1>Memory Game</h1>
        <p>Flip, match, and win!</p>
        {onToggleTheme && (
          <button 
            className="theme-toggle-button" 
            onClick={onToggleTheme}
            title={`Current: ${colorTheme} theme`}
          >
            {colorTheme === 'light' ? '☀️' : colorTheme === 'dark' ? '🌙' : '⚙️'}
          </button>
        )}
      </div>

      <div className="menu-content">
        {/* Game Mode Selection */}
        <div className="menu-section">
          <h2 className="section-title">Game Mode</h2>
          <div className="selection-grid">
            <button
              className={`selection-card mode-card ${mode === 'single' ? 'active' : ''}`}
              onClick={() => setMode('single')}
            >
              <div className="card-icon">👤</div>
              <div className="card-label">Single Player</div>
            </button>
            <button
              className={`selection-card mode-card ${mode === 'multi' ? 'active' : ''}`}
              onClick={() => setMode('multi')}
            >
              <div className="card-icon">👥</div>
              <div className="card-label">Multiplayer</div>
            </button>
          </div>
        </div>

        {/* Number of Players (Multiplayer Only) */}
        {mode === 'multi' && (
          <div className="menu-section">
            <h2 className="section-title">Number of Players</h2>
            <div className="selection-grid three-cols">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`selection-card player-count-card ${playerCount === num ? 'active' : ''}`}
                  onClick={() => setPlayerCount(num)}
                >
                  <div className="card-icon">{num}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Names (Multiplayer Only) */}
        {mode === 'multi' && (
          <div className="menu-section">
            <h2 className="section-title">Player Names</h2>
            <div className="player-names-grid">
              {[0, 1, 2, 3].map((idx) => (
                idx < playerCount && (
                  <div key={idx} className="player-name-wrapper">
                    <div className="player-color-dot" style={{
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#C7F464', '#C44DFF'][idx]
                    }}></div>
                    <input
                      type="text"
                      maxLength={12}
                      value={playerNames[idx]}
                      onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                      className="player-name-input"
                      placeholder={`Player ${idx + 1}`}
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="menu-section">
          <h2 className="section-title">Difficulty</h2>
          <div className="selection-grid three-cols">
            {Object.entries(DIFFICULTIES).map(([key, value]) => {
              const disabled = isDifficultyDisabled(key);
              return (
                <button
                  key={key}
                  className={`selection-card difficulty-card difficulty-${key} ${difficulty === key ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                  onClick={() => { if (!disabled) setDifficulty(key); }}
                  disabled={disabled}
                >
                  <div className="card-icon">⊞</div>
                  <div className="card-label">{value.label}</div>
                  <div className="card-subtext">{value.size}×{value.size}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="menu-section">
          <h2 className="section-title">Theme</h2>
          <div className="selection-grid">
            {Object.entries(THEMES).map(([key, value]) => (
              <button
                key={key}
                className={`selection-card theme-card ${theme === key ? 'active' : ''}`}
                onClick={() => setTheme(key)}
              >
                <div className="card-icon">{themeIcons[key]}</div>
                <div className="card-label">{themeNames[key]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Game Button */}
        <button className="start-button" onClick={handleStartGame}>
          ✨ Start Game
        </button>
      </div>
    </div>
  );
}

export default MenuScreen;
