import { memo } from 'react';

function Card({ card, onClick }) {
  const { emoji, color, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick();
    }
  };

  // Calculate complementary color for background
  const getComplementaryColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    return `rgba(${compR}, ${compG}, ${compB}, 0.3)`;
  };

  const backgroundColor = getComplementaryColor(color);

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-inner" style={{ transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div className="card-face card-back"></div>
        <div className="card-face card-front" style={{ backgroundColor, border: `4px solid ${color}` }}>
          <span className="emoji-sprite">{emoji}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(Card);
