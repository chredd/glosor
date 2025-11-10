import React, { useEffect, useState } from "react";
import "./HalloweenFireworks.css";

const EMOJIS = ["🎃", "👻"];
const FIREWORKS_COUNT = 15;
const PARTICLES_PER_FIREWORK = 8;

function getRandomExplosionPosition() {
  return {
    top: `${10 + Math.random() * 40}%`,
    left: `${10 + Math.random() * 80}%`,
  };
}

const HalloweenFireworks: React.FC = () => {
  const [fireworks, setFireworks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fireworkElements: JSX.Element[] = [];

    for (let i = 0; i < FIREWORKS_COUNT; i++) {
      const delay = Math.random() * 2;
      const explosionPos = getRandomExplosionPosition();
      const emoji = EMOJIS[i % EMOJIS.length];

      // Create particles for each firework
      for (let j = 0; j < PARTICLES_PER_FIREWORK; j++) {
        const angle = (360 / PARTICLES_PER_FIREWORK) * j;
        fireworkElements.push(
          <span
            className="firework-particle"
            key={`${i}-${j}`}
            style={{
              position: "absolute",
              top: explosionPos.top,
              left: explosionPos.left,
              animationDelay: `${delay}s`,
              "--angle": `${angle}deg`,
            } as React.CSSProperties}
          >
            {emoji}
          </span>
        );
      }
    }

    setFireworks(fireworkElements);

    // Remove fireworks after animation completes
    const timeout = setTimeout(() => setFireworks([]), 4000);
    return () => clearTimeout(timeout);
  }, []);

  return fireworks.length > 0 ? (
    <div className="halloween-fireworks">{fireworks}</div>
  ) : null;
};

export default HalloweenFireworks;
