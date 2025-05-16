import React, { useEffect } from 'react';

const STAR_COUNT = 40;

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

const StarRain: React.FC = () => {
  useEffect(() => {
    // Optional: Add animation cleanup if needed
    return () => {};
  }, []);

  return (
    <div className="star-rain-overlay">
      {Array.from({ length: STAR_COUNT }).map((_, i) => {
        const left = randomBetween(0, 100);
        const duration = randomBetween(1.8, 3.5);
        const delay = randomBetween(0, 1.5);
        const size = randomBetween(16, 32);
        return (
          <span
            key={i}
            className="star"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 32 32" fill="gold">
              <polygon points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12" />
            </svg>
          </span>
        );
      })}
    </div>
  );
};

export default StarRain;
