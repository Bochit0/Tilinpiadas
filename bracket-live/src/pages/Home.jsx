import React from 'react';
import { motion } from 'framer-motion';
import Starfield from '../components/ui/Starfield';
import ActionCard from '../components/ui/ActionCard';


export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0914] to-[#1A1025] flex flex-col items-center justify-center font-sans text-white">
      
      {/* Nuestro componente modular de fondo 3D */}
      <Starfield />

      {/* Título Principal */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 mb-12 text-center"
      >
        <h1 className="text-6xl font-extrabold tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(155,77,255,0.5)]">
          Bracket.<span className="text-[#00F2FE]">live</span>
        </h1>
        <p className="text-[#8E94A5] text-xl">El escenario digital para tus competencias</p>
      </motion.div>

      {/* Contenedor de las Tarjetas usando nuestro "Molde" */}
      <div className="z-10 flex flex-col md:flex-row gap-8 w-full max-w-4xl px-6">
        
        <ActionCard 
          title="Crear un torneo"
          description="Configura llaves, equipos y controla los resultados en tiempo real."
          href="/admin"
          accentColor="#9B4DFF" // Púrpura vibrante
          delay={0.2}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        />

        <ActionCard 
          title="Mirar un torneo"
          description="Abre la vista limpia para conectarla a tu transmisión u OBS."
          href="/stream"
          accentColor="#00F2FE" // Cian eléctrico
          delay={0.4}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />

      </div>
    </div>
  );
}
