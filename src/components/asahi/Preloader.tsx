import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Bloquear el scroll
    document.body.style.overflow = 'hidden';
    
    // Simular progreso de carga
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          document.body.style.overflow = 'unset';
        }, 500); // Pequeña pausa al llegar al 100%
      }
      setProgress(currentProgress);
    }, 100);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 md:p-10 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            <div>Asahi Studio</div>
            <div className="font-jp tracking-widest hidden sm:block text-xs">朝日 - 旭</div>
            <div>MX — 2026</div>
          </div>

          {/* Centro: Sol y Logo */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Sol Rojo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-32 w-32 rounded-full bg-primary sun-pulse"
              style={{
                boxShadow: '0 0 60px var(--color-primary)'
              }}
            />
            
            {/* Logo debajo del sol */}
            <motion.img 
              src="/Identidad/Logo%20only%20letter.svg"
              alt="Asahi Studio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-8 w-auto opacity-90"
            />
          </div>

          {/* Elementos Inferiores: Texto y Barra */}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="flex justify-between items-center px-6 md:px-10 pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              <div>Cargando Experiencia</div>
              <div>{progress < 100 ? `0${progress}`.slice(-2) : '100'}</div>
            </div>
            {/* Barra inferior */}
            <div className="h-0.5 w-full bg-border">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
