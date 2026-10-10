import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ActionCard({ title, description, href, icon, delay, accentColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: delay > 0.3 ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      // Usamos el color dinámico para el brillo (sombra)
      whileHover={{ scale: 1.05, boxShadow: `0px 0px 30px ${accentColor}66` }} 
      className="flex-1 bg-[#211833]/80 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center transition-all focus-within:ring-2 focus-within:ring-white/60"
    >
      <Link to={href} className="w-full h-full p-10 flex flex-col items-center justify-center rounded-2xl focus:outline-none">
        {/* Círculo del ícono */}
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors"
          style={{ backgroundColor: `${accentColor}33` }} // Fondo con opacidad
        >
          <div style={{ color: accentColor }} className="w-10 h-10">
            {icon}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-[#8E94A5]">{description}</p>
      </Link>
    </motion.div>
  );
}
