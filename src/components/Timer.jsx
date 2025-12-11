import { useEffect, useState } from 'react';

function Timer({ isGameStarted, isGameOver }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver]);

  useEffect(() => {
    if (!isGameStarted) {
      setSeconds(0);
    }
  }, [isGameStarted]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="timer">
      <span className="timer-label">Time:</span>
      <span className="timer-value">{formattedTime}</span>
    </div>
  );
}

export default Timer;
