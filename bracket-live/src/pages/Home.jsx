//src/pages/Home.jsx
import React from 'react';

export default function Home() {
  return (
    // Usamos Tailwind para darle fondo oscuro, centrar todo y poner texto blanco
    <div className="min-h-screen bg-[#212330] flex flex-col items-center justify-center text-white">
      
      {/* Título principal con un color vibrante */}
      <h1 className="text-5xl font-bold mb-4">
        Bracket.<span className="text-[#00F2FE]">live</span>
      </h1>
      
      <p className="text-[#8E94A5] mb-8 text-lg text-center max-w-md">
        Genera cuadros de torneo dinámicos con animaciones para tus transmisiones en vivo, totalmente gratis.
      </p>

      {/* Botón que simula ir a la página de administración para crear el torneo */}
      <a 
        href="/admin" 
        className="bg-[#9B4DFF] hover:bg-[#A150F3] text-white font-semibold py-3 px-8 rounded-lg transition-all"
      >
        Crear Nuevo Torneo
      </a>
      
    </div>
  );
}
