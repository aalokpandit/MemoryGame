import { memo } from 'react';
import Card from './Card';

function Board({ cards, onCardClick, gridSize }) {
  // Calculate the optimal card size based on available space
  const calculateCardSize = () => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    
    // Account for header (~50px), controls (~50px), padding (60px total), and gaps
    const availableHeight = vh - 160;
    const availableWidth = vw - 60;
    
    const gap = 10;
    const totalGaps = (gridSize - 1) * gap;
    
    const maxCardHeightFromHeight = (availableHeight - totalGaps) / gridSize;
    const maxCardWidthFromWidth = (availableWidth - totalGaps) / gridSize;
    
    // Use the smaller of the two to ensure it fits
    const cardSize = Math.floor(Math.min(maxCardHeightFromHeight, maxCardWidthFromWidth));
    
    return Math.max(cardSize, 50); // Minimum 50px
  };

  const cardSize = calculateCardSize();

  return (
    <div 
      className="board" 
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, ${cardSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cardSize}px)`
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
}

export default memo(Board);
