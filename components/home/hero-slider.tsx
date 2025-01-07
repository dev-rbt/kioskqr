"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/img/slider/slider1.jpg',
  '/img/slider/slider2.jpg'
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <img 
                src={images[currentIndex]}
                alt="Hero slider"
                className="max-w-full max-h-full w-auto h-auto object-contain"
                loading="eager"
              />
            </div>
            {/* Overlay gradient - more subtle now */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
