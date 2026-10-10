import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// fixed: se queda detrás de toda la pantalla (para páginas con scroll). Sin fixed: llena su contenedor `relative`.
export default function Starfield({ fixed = false }) {
  const reduceMotion = useReducedMotion();

  // Generamos 50 estrellas aleatorias una sola vez (useMemo evita que se re-sorteen en cada render)
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      })),
    [],
  );

  return (
    <div
      aria-hidden="true"
      className={`${fixed ? 'fixed -z-10' : 'absolute z-0'} inset-0 overflow-hidden pointer-events-none`}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          animate={
            reduceMotion
              ? { opacity: 0.6 } // Con "reducir movimiento": estrellas quietas
              : {
                  y: [0, -1000], // Se mueven hacia arriba
                  opacity: [0, 1, 0], // Aparecen y desaparecen
                  scale: [1, 1.5],
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: star.duration, repeat: Infinity, delay: star.delay, ease: 'linear' }
          }
        />
      ))}
    </div>
  );
}
