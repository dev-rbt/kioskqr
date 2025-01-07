"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import { languages, type Language } from '@/lib/i18n';

export default function WelcomePage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const { currentLanguage, setLanguage, t } = useLanguageStore();

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/menu');
    }, 500);
  };

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    document.documentElement.dir = languages[language].dir;
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-transparent to-orange-500/30" />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/20 via-transparent to-pink-500/20" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          </div>

          {/* Language Switcher Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            {/* Language Title */}
            <div className="flex flex-col items-center pt-8 pb-4">
              <div className="flex items-center gap-2 text-white/90 mb-4">
                <Globe className="w-5 h-5" />
                <span className="text-lg font-medium">{t.common.languageSelection}</span>
              </div>
            </div>

            {/* Language Options */}
            <div className="flex justify-center">
              <div className="flex gap-3 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 shadow-2xl">
                {Object.entries(languages).map(([key, { name, flag }]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageSelect(key as Language)}
                    className={`relative group min-w-[140px] ${
                      currentLanguage === key 
                        ? '' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {/* Background for active state */}
                    {currentLanguage === key && (
                      <motion.div
                        layoutId="activeLanguage"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/80 to-primary/60"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Content */}
                    <div className={`relative flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                      currentLanguage === key 
                        ? 'text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}>
                      <span className="text-3xl">{flag}</span>
                      <span className="font-medium">{name}</span>

                      {/* Active Indicator */}
                      {currentLanguage === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 w-12 h-1 rounded-full bg-white"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div 
            className="relative h-full flex flex-col items-center justify-center p-8"
            onClick={handleClick}
          >
            {/* Logo and Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-20"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-orange-500/50 blur-2xl animate-pulse" />
                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <ShoppingBag className="w-20 h-20 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Lezzet Restoran
              </h1>
              <div className="text-lg text-white/60 tracking-widest">
                {t.common.digitalMenu}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-orange-500/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all">
                  <span className="text-3xl md:text-4xl font-medium text-white">
                    {t.common.welcomeMessage}
                  </span>
                  <ChevronRight className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* Touch Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 left-0 right-0 flex justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-white/60 text-lg font-medium tracking-wide"
              >
                {t.common.tapToViewMenu}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
