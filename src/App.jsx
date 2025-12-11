import { useState, useEffect } from 'react';
import Board from './components/Board';
import './App.css';

const THEMES = {
  animals: [
    { name: 'Dog', color: '#FF5733' },
    { name: 'Cat', color: '#33FF57' },
    { name: 'Cow', color: '#3357FF' },
    { name: 'Lion', color: '#FF33A1' },
    { name: 'Bear', color: '#F3FF33' },
    { name: 'Duck', color: '#A133FF' },
    { name: 'Panda', color: '#33FFA1' },
    { name: 'Tiger', color: '#FF9F33' },
    { name: 'Elephant', color: '#FF6B9D' },
    { name: 'Fox', color: '#C70039' },
    { name: 'Wolf', color: '#900C3F' },
    { name: 'Rabbit', color: '#581845' },
    { name: 'Deer', color: '#FFC300' },
    { name: 'Giraffe', color: '#DAF7A6' },
    { name: 'Zebra', color: '#33FFD5' },
    { name: 'Monkey', color: '#3385FF' },
    { name: 'Horse', color: '#8E44AD' },
    { name: 'Sheep', color: '#E74C3C' },
    { name: 'Goat', color: '#16A085' },
    { name: 'Pig', color: '#F39C12' },
    { name: 'Chicken', color: '#D35400' },
    { name: 'Eagle', color: '#7D3C98' },
    { name: 'Owl', color: '#2874A6' },
    { name: 'Penguin', color: '#148F77' },
    { name: 'Dolphin', color: '#D98880' },
    { name: 'Whale', color: '#C39BD3' },
    { name: 'Shark', color: '#76D7C4' },
    { name: 'Turtle', color: '#F8C471' },
    { name: 'Frog', color: '#82E0AA' },
    { name: 'Snake', color: '#AED6F1' },
    { name: 'Lizard', color: '#F9E79F' },
    { name: 'Butterfly', color: '#FADBD8' },
  ],
  fruits: [
    { name: 'Apple', color: '#FF0800' },
    { name: 'Banana', color: '#FFE135' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Grape', color: '#6F2DA8' },
    { name: 'Strawberry', color: '#FC5A8D' },
    { name: 'Watermelon', color: '#FC6C85' },
    { name: 'Pineapple', color: '#FDD017' },
    { name: 'Mango', color: '#FDBE02' },
    { name: 'Cherry', color: '#DE3163' },
    { name: 'Blueberry', color: '#4F86F7' },
    { name: 'Peach', color: '#FFE5B4' },
    { name: 'Pear', color: '#D1E231' },
    { name: 'Kiwi', color: '#8EE53F' },
    { name: 'Lemon', color: '#FFF44F' },
    { name: 'Lime', color: '#BFFF00' },
    { name: 'Coconut', color: '#8B4513' },
    { name: 'Papaya', color: '#FFEFD5' },
    { name: 'Avocado', color: '#568203' },
    { name: 'Tomato', color: '#FF6347' },
    { name: 'Carrot', color: '#ED9121' },
    { name: 'Broccoli', color: '#4E8B3D' },
    { name: 'Corn', color: '#FBEC5D' },
    { name: 'Cucumber', color: '#39FF14' },
    { name: 'Eggplant', color: '#614051' },
    { name: 'Lettuce', color: '#90EE90' },
    { name: 'Onion', color: '#E6E6FA' },
    { name: 'Pepper', color: '#FF033E' },
    { name: 'Potato', color: '#D2B48C' },
    { name: 'Pumpkin', color: '#FF7518' },
    { name: 'Radish', color: '#E30B5C' },
    { name: 'Spinach', color: '#097969' },
    { name: 'Zucchini', color: '#228B22' },
  ],
  vehicles: [
    { name: 'Car', color: '#FF0000' },
    { name: 'Bus', color: '#FFD700' },
    { name: 'Train', color: '#4169E1' },
    { name: 'Plane', color: '#87CEEB' },
    { name: 'Bike', color: '#32CD32' },
    { name: 'Truck', color: '#FF4500' },
    { name: 'Boat', color: '#1E90FF' },
    { name: 'Ship', color: '#000080' },
    { name: 'Helicopter', color: '#FF6347' },
    { name: 'Motorcycle', color: '#FF1493' },
    { name: 'Scooter', color: '#00CED1' },
    { name: 'Taxi', color: '#FFFF00' },
    { name: 'Ambulance', color: '#FF0000' },
    { name: 'FireTruck', color: '#DC143C' },
    { name: 'PoliceCar', color: '#0000FF' },
    { name: 'Van', color: '#708090' },
    { name: 'Subway', color: '#A9A9A9' },
    { name: 'Tram', color: '#FFB6C1' },
    { name: 'Yacht', color: '#FFFFFF' },
    { name: 'Canoe', color: '#8B4513' },
    { name: 'Jet', color: '#C0C0C0' },
    { name: 'Rocket', color: '#FF4500' },
    { name: 'Balloon', color: '#FF69B4' },
    { name: 'Parachute', color: '#00FFFF' },
    { name: 'Skateboard', color: '#FF8C00' },
    { name: 'Rollerblade', color: '#9370DB' },
    { name: 'Segway', color: '#20B2AA' },
    { name: 'Cart', color: '#DAA520' },
    { name: 'Wagon', color: '#CD853F' },
    { name: 'Sled', color: '#F0E68C' },
    { name: 'Snowmobile', color: '#E0FFFF' },
    { name: 'Hovercraft', color: '#B0C4DE' },
  ],
  objects: [
    { name: 'Book', color: '#8B4513' },
    { name: 'Pen', color: '#0000FF' },
    { name: 'Cup', color: '#FF69B4' },
    { name: 'Phone', color: '#000000' },
    { name: 'Laptop', color: '#C0C0C0' },
    { name: 'Watch', color: '#FFD700' },
    { name: 'Glasses', color: '#A0522D' },
    { name: 'Key', color: '#FFD700' },
    { name: 'Wallet', color: '#654321' },
    { name: 'Bag', color: '#FF6347' },
    { name: 'Shoe', color: '#1E90FF' },
    { name: 'Hat', color: '#FF4500' },
    { name: 'Clock', color: '#2F4F4F' },
    { name: 'Lamp', color: '#FFFFE0' },
    { name: 'Chair', color: '#8B4513' },
    { name: 'Table', color: '#D2691E' },
    { name: 'Mirror', color: '#E0E0E0' },
    { name: 'Picture', color: '#DAA520' },
    { name: 'Vase', color: '#4682B4' },
    { name: 'Pillow', color: '#FFF8DC' },
    { name: 'Blanket', color: '#CD853F' },
    { name: 'Candle', color: '#FFFACD' },
    { name: 'Plate', color: '#FFFFFF' },
    { name: 'Fork', color: '#C0C0C0' },
    { name: 'Spoon', color: '#C0C0C0' },
    { name: 'Knife', color: '#808080' },
    { name: 'Bowl', color: '#ADD8E6' },
    { name: 'Bottle', color: '#00FF00' },
    { name: 'Scissors', color: '#FF0000' },
    { name: 'Tape', color: '#FFFF00' },
    { name: 'Stapler', color: '#000000' },
    { name: 'Notebook', color: '#87CEEB' },
  ],
};

const DIFFICULTIES = {
  easy: { size: 4, pairs: 8 },
  medium: { size: 6, pairs: 18 },
  hard: { size: 8, pairs: 32 },
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateCards(theme, pairsCount) {
  const themeItems = THEMES[theme];
  const shuffledItems = shuffle([...themeItems]);
  const selectedItems = shuffledItems.slice(0, pairsCount);
  
  const cards = [];
  let id = 1;
  for (const item of selectedItems) {
    cards.push({ id: id++, value: item.name, color: item.color, isFlipped: false, isMatched: false });
    cards.push({ id: id++, value: item.name, color: item.color, isFlipped: false, isMatched: false });
  }
  return shuffle(cards);
}

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('animals');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isBoardLocked, setIsBoardLocked] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameWon(true);
    }
  }, [cards]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsBoardLocked(true);
      const [first, second] = flippedCards;
      if (cards[first].value === cards[second].value) {
        setCards(prev => prev.map(card => {
          if (card.id === cards[first].id || card.id === cards[second].id) {
            return { ...card, isMatched: true, isFlipped: false };
          }
          return card;
        }));
        setFlippedCards([]);
        setIsBoardLocked(false);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => {
            if (index === first || index === second) {
              return { ...card, isFlipped: false };
            }
            return card;
          }));
          setFlippedCards([]);
          setIsBoardLocked(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (clickedIndex) => {
    if (isBoardLocked || flippedCards.length === 2 || cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched) {
      return;
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

  const startGame = () => {
    const pairsCount = DIFFICULTIES[difficulty].pairs;
    setCards(generateCards(theme, pairsCount));
    setGameInitialized(true);
    setFlippedCards([]);
    setIsBoardLocked(false);
    setIsGameWon(false);
  };

  const resetGame = () => {
    setGameInitialized(false);
    setCards([]);
    setFlippedCards([]);
    setIsBoardLocked(false);
    setIsGameWon(false);
  };

  const gridSize = DIFFICULTIES[difficulty].size;
  const actionLabel = !gameInitialized ? 'Start Game' : isGameWon ? 'Play Another Game' : 'Reset';
  const actionHandler = !gameInitialized ? startGame : (isGameWon ? resetGame : resetGame);

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <div className="top-controls">
        <div className="control-group">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={gameInitialized}>
            <option value="easy">Easy (4x4)</option>
            <option value="medium">Medium (6x6)</option>
            <option value="hard">Hard (8x8)</option>
          </select>
        </div>
        <div className="control-group">
          <label>Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} disabled={gameInitialized}>
            <option value="animals">Animals</option>
            <option value="fruits">Fruits & Vegetables</option>
            <option value="vehicles">Vehicles & Transport</option>
            <option value="objects">Everyday Objects</option>
          </select>
        </div>
        <button onClick={actionHandler} className="action-button">{actionLabel}</button>
      </div>
      {gameInitialized && (
        <div className="board-container">
          <Board cards={cards} onCardClick={handleCardClick} gridSize={gridSize} />
          {isGameWon && (
            <div className="win-overlay">
              <div className="win-screen">
                <h2>You Win!</h2>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
