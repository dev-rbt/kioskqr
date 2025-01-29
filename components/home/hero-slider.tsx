"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from '@/types/branch';
import useBranchStore from '@/store/branch';



export function HeroSlider({banners}: {banners: Banner[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {branchData} = useBranchStore();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={banners[currentIndex].BannerUrl}
              alt="Hero slider"
              className="w-full max-h-full"
              loading="eager"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            style={index === currentIndex ? {backgroundColor: branchData?.SecondColor} : {backgroundColor: '#fff'}}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );
}
