import { useState, useEffect } from 'react';
import Board from './components/Board';
import './App.css';

const animalPairs = [
  { name: 'Dog', color: '#FF5733' },
  { name: 'Cat', color: '#33FF57' },
  { name: 'Cow', color: '#3357FF' },
  { name: 'Lion', color: '#FF33A1' },
  { name: 'Bear', color: '#F3FF33' },
  { name: 'Duck', color: '#A133FF' },
  { name: 'Panda', color: '#33FFA1' },
  { name: 'Tiger', color: '#FF9F33' },
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateCards() {
  const cards = [];
  let id = 1;
  for (const animal of animalPairs) {
    cards.push({ id: id++, value: animal.name, color: animal.color, isFlipped: false, isMatched: false });
    cards.push({ id: id++, value: animal.name, color: animal.color, isFlipped: false, isMatched: false });
  }
  return shuffle(cards);
}

function App() {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [isBoardLocked, setIsBoardLocked] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

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

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setIsBoardLocked(false);
    setIsGameWon(false);
  };

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      {isGameWon ? (
        <div className="win-screen">
          <h2>You Win!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <>
          <Board cards={cards} onCardClick={handleCardClick} />
          <button onClick={resetGame} className="reset-button">Reset Game</button>
        </>
      )}
    </div>
  );
}

export default App;
