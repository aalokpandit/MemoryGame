import { memo } from 'react';

function Card({ card, onClick }) {
  const { value, color, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick();
    }
  };

  // Calculate contrasting text color based on background color
  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(color);

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-inner" style={{ transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div className="card-face card-back"></div>
        <div className="card-face card-front" style={{ backgroundColor: color, color: textColor }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default memo(Card);
