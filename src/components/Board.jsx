import { memo } from 'react';
import Card from './Card';

function Board({ cards, onCardClick }) {
  return (
    <div className="board">
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
