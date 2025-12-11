import { memo } from 'react';
import Card from './Card';

function Board({ cards, onCardClick, gridSize }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${gridSize}, 100px)` }}>
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
