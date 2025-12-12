import { THEMES } from '../data/themes';

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateCards(theme, pairsCount) {
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
