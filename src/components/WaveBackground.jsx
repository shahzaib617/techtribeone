import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 40; // Increased the number of dots per row/column
const DOT_SIZE = 4; // Size of each dot
const GAP = 1; // Decreased gap between dots
const WAVE_DURATION = 3; // Duration of animation in seconds

const generateGrid = () => {
  const dots = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      dots.push({ x, y, id: `${x}-${y}` });
    }
  }
  return dots;
};

const HalftoneAnimation = () => {
  const [dots, setDots] = useState(generateGrid);

  return (
    <div
      className="fixed flex items-center justify-center w-full h-screen bg-black"
      style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: GAP }}
    >
      {dots.map(({ x, y, id }) => (
        <motion.div
          key={id}
          className="rounded-full bg-white"
          style={{ width: DOT_SIZE, height: DOT_SIZE }}
          initial={{ opacity: 1 }}
          animate={{
            opacity: [1, 0.5, 0],
            x: [0, (Math.random() - 0.5) * 10, 0],
            y: [0, (Math.random() - 0.5) * 10, 0],
          }}
          transition={{
            duration: WAVE_DURATION,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * WAVE_DURATION, // Staggered effect
          }}
        />
      ))}
    </div>
  );
};

export default HalftoneAnimation;
