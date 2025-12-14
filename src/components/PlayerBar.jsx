import { useState } from 'react';
import '../styles/PlayerBar.css';

function PlayerBar({ players, playerCount, activePlayerIndex }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const activePlayers = players.slice(0, playerCount);

  return (
    <div className="player-bar">
      {activePlayers.map((player, idx) => {
        const isActive = idx === activePlayerIndex;
        const isExpanded = expandedIndex === idx;

        return (
          <div
            key={player.id}
            className={`player-card ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
            style={{ borderColor: player.color }}
          >
            <button
              className="player-card-content"
              onClick={() => toggleExpanded(idx)}
            >
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-score">Score: {player.matches}</div>
              </div>
            </button>

            {isExpanded && player.matchedItems.length > 0 && (
              <div className="player-matches" style={{ backgroundColor: `${player.color}15` }}>
                <div className="matches-title">Matched:</div>
                <div className="matches-list">
                  {player.matchedItems.map((item) => (
                    <span key={item} className="match-item">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PlayerBar;
