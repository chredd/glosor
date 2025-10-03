import React, { useEffect, useState } from "react";
import "./UnicornRain.css";


const UNICORN_EMOJI = "🦄";

const UNICORN_COUNT = 100;

function getRandomPosition() {
  // Avoid edges (5% to 95%)
  return {
    top: `${5 + Math.random() * 90}%`,
    left: `${5 + Math.random() * 90}%`,
  };
}


const UnicornRain: React.FC = () => {
  const [unicorns, setUnicorns] = useState<JSX.Element[]>([]);


  useEffect(() => {
    const unicornElements: JSX.Element[] = [];
    for (let i = 0; i < UNICORN_COUNT; i++) {
      const delay = Math.random() * 0.5;
      const { top, left } = getRandomPosition();
      unicornElements.push(
        <span
          className="unicorn zoom"
          key={i}
          style={{
            position: "absolute",
            top,
            left,
            animationDelay: `${delay}s`,
          }}
        >
          {UNICORN_EMOJI}
        </span>
      );
    }
    setUnicorns(unicornElements);

    // Remove unicorns after 2.5 seconds
    const timeout = setTimeout(() => setUnicorns([]), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return unicorns.length > 0 ? <div className="unicorn-rain">{unicorns}</div> : null;
};

export default UnicornRain;
