import { memo, useEffect, useState } from 'react';
import Card from './Card';

function Board({ cards, onCardClick, gridSize, boardArea }) {
  const baseGap = gridSize >= 8 ? 0 : gridSize >= 6 ? 1.5 : 4;
  const safety = gridSize >= 8 ? 12 : gridSize >= 6 ? 8 : 0; // reduced to allow more room for gaps

  // Card size is derived from the measured board area so the grid fits the available space.
  const calculateCardSize = () => {
    const availableWidth = Math.max(0, (boardArea?.width ?? 0) - safety);
    const availableHeight = Math.max(0, (boardArea?.height ?? 0) - safety);

    if (!availableWidth || !availableHeight) {
      return 80; // fallback while layout settles
    }

    const totalGaps = (gridSize - 1) * baseGap;

    const maxCardHeightFromHeight = (availableHeight - totalGaps) / gridSize;
    const maxCardWidthFromWidth = (availableWidth - totalGaps) / gridSize;

    const cardSize = Math.floor(Math.min(maxCardHeightFromHeight, maxCardWidthFromWidth));

    return Math.max(cardSize, 2); // allow tiles to shrink further on very tight mobile layouts
  };

  const calculateDynamicGap = (cardSize) => {
    const totalGaps = (gridSize - 1) * baseGap;
    const cardsSize = gridSize * cardSize;
    let availableWidth = boardArea?.width ?? 0;
    let availableHeight = boardArea?.height ?? 0;

    const widthLeftover = availableWidth - (cardsSize + totalGaps) - safety;
    const heightLeftover = availableHeight - (cardsSize + totalGaps) - safety;

    if (widthLeftover > 0 || heightLeftover > 0) {
      // Distribute leftover as extra gap (limit to 2.5px per gap to avoid excess)
      const extra = Math.min(2.5, Math.floor(Math.min(widthLeftover, heightLeftover) / (gridSize - 1)));
      return baseGap + Math.max(0, extra);
    }

    return baseGap;
  };

  const [cardSize, setCardSize] = useState(calculateCardSize());
  const gap = calculateDynamicGap(cardSize);

  useEffect(() => {
    setCardSize(calculateCardSize());
  }, [boardArea?.width, boardArea?.height, gridSize]);

  return (
    <div 
      className="board" 
      style={{ 
        width: '100%',
        height: '100%',
        gridTemplateColumns: `repeat(${gridSize}, ${cardSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cardSize}px)`,
        gap: `${gap}px`
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
