import { useEffect, useState } from 'react';

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const FlashSaleTimer = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState(() => new Date(endsAt).getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(endsAt).getTime() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  if (timeLeft <= 0) {
    return <span className="text-xs text-red-600">Flash sale ended</span>;
  }

  return (
    <span className="text-xs text-red-600">Ends in {formatTime(timeLeft)}</span>
  );
};

export default FlashSaleTimer;
