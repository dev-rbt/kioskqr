'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Utensils, Globe } from 'lucide-react';
import useBranchStore from '@/store/branch';
import { OrderType } from '@/types/branch';
import type { Language } from '@/types/branch';

const LanguageSwitcher = () => {
  const { branchData, selectedLanguage, setSelectedLanguage, t } = useBranchStore();

  const handleLanguageSelect = (language: Language) => {
    if (!branchData) return;
    setSelectedLanguage(branchData.BranchID.toString(), language);
  };

  return (
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
          {branchData?.Languages?.map((language) => (
            <motion.button
              key={language.Key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLanguageSelect(language)}
              className={`relative group min-w-[140px] ${
                selectedLanguage?.Key === language.Key
                  ? ''
                  : 'hover:bg-white/10'
              }`}
            >
              {/* Background for active state */}
              {selectedLanguage?.Key === language.Key && (
                <motion.div
                  layoutId="activeLanguage"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/80 to-primary/60"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Content */}
              <div className={`relative flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                selectedLanguage?.Key === language.Key
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}>
                <span className="text-3xl">{language.Code}</span>
                <span className="font-medium">{language.Name}</span>

                {/* Active Indicator */}
                {selectedLanguage?.Key === language.Key && (
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
  );
};

export default function WelcomePage() {
  const router = useRouter();
  const { branchData, selectedLanguage, setSelectedLanguage, setSelectedOrderType, t } = useBranchStore();
  const [showContent, setShowContent] = useState(false);

  const handleClick = async (orderType: OrderType) => {
    if (!branchData) return;

    localStorage.setItem(
      `branch_orderType_${branchData.BranchID}`,
      orderType
    );

    setSelectedOrderType(branchData?.BranchID.toString(), orderType);
    router.push(`/${branchData.BranchID}/menu`);
  };

  if (!branchData) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            height: '100vh',
            width: '100%',
            objectFit: 'fill',
            position: 'absolute'
          }}
        >
          <source src="/tavukdunyasi.webm" type="video/webm" />
        </video>
      </div>

      {/* Language Switcher - Always visible */}
      <LanguageSwitcher />

      {!showContent ? (
        // Splash Screen
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => setShowContent(true)}
        >
          <motion.div
            className="absolute bottom-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.4, 1, 0.4],
              y: [0, -10, 0],
              transition: {
                opacity: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                },
                y: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }
              }
            }}
          >
            <span className="text-white/90 text-2xl font-medium tracking-wider">
              {t.common.tapToViewMenu}
            </span>
          </motion.div>
        </motion.div>
      ) : (
        // Main Content
        <AnimatePresence>
          <motion.div
            className="relative z-10 min-h-screen flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-orange-500/50 blur-2xl animate-pulse" />
                  <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-full border border-white/10">
                    <ShoppingBag className="w-20 h-20 text-white" />
                  </div>
                </div>
                <h1 className="p-3 text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                  {branchData.BranchName}
                </h1>
                <div className="text-lg text-white/60 tracking-widest">
                  {t.common.welcomeMessage}
                </div>
              </motion.div>

              {/* Order Type Selection */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-row gap-6 w-full max-w-2xl justify-center mt-20 mx-auto"
              >
                <button
                  onClick={() => handleClick(OrderType.TAKEOUT)}
                  className="group relative aspect-square w-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-orange-500/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex flex-col items-center justify-center gap-4 h-full rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all">
                    <Utensils className="w-16 h-16 text-white" />
                    <span className="text-2xl font-medium text-white">
                      {t.common.dineIn}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleClick(OrderType.DELIVERY)}
                  className="group relative aspect-square w-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-orange-500/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex flex-col items-center justify-center gap-4 h-full rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all">
                    <ShoppingBag className="w-16 h-16 text-white" />
                    <span className="text-2xl font-medium text-white">
                      {t.common.takeout}
                    </span>
                  </div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
