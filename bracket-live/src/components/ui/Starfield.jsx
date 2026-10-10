import React from 'react';
import { motion } from 'framer-motion';

export default function Starfield() {
  // Generamos 50 estrellas aleatorias una sola vez
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          animate={{
            y: [0, -1000], // Se mueven hacia arriba
            opacity: [0, 1, 0], // Aparecen y desaparecen
            scale: [1, 1.5]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
