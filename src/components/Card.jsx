import { memo } from 'react';

function Card({ card, onClick }) {
  const { value, color, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick();
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-inner" style={{ transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div className="card-face card-back"></div>
        <div className="card-face card-front" style={{ backgroundColor: color }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default memo(Card);
