import React, { useEffect, useState } from "react";
import "./SnowFall.css";

const CHRISTMAS_EMOJIS = ["🎅", "🎄", "🎁", "🔔", "⭐", "🦌", "🤶"];
const SNOWFLAKE_COUNT = 30;

interface Snowflake {
  id: number;
  emoji: string;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
}

const SnowFall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
      flakes.push({
        id: i,
        emoji: CHRISTMAS_EMOJIS[Math.floor(Math.random() * CHRISTMAS_EMOJIS.length)],
        left: Math.random() * 100, // Random position across screen
        animationDuration: 3 + Math.random() * 4, // 3-7 seconds
        animationDelay: Math.random() * 2, // 0-2 seconds delay
        size: 0.8 + Math.random() * 0.7, // 0.8-1.5 size multiplier
      });
    }

    setSnowflakes(flakes);

    // Remove snowflakes after animation completes
    const timeout = setTimeout(() => setSnowflakes([]), 8000);
    return () => clearTimeout(timeout);
  }, []);

  return snowflakes.length > 0 ? (
    <div className="snowfall">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            fontSize: `${flake.size * 2}em`,
          }}
        >
          {flake.emoji}
        </span>
      ))}
    </div>
  ) : null;
};

export default SnowFall;
