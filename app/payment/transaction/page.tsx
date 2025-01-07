"use client";

import { useCartStore } from '../../../store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { useState, useEffect } from 'react';
import { printService } from '../../../lib/utils/print-service';
import { isElastic } from '../../../lib/utils/elastic';

const STEPS = [
  { id: 1, title: "Bağlantı Kuruluyor", duration: 2000 },
  { id: 2, title: "Kart Bilgileri Doğrulanıyor", duration: 3000 },
  { id: 3, title: "İşlem Tamamlanıyor", duration: 2000 },
];

export default function PaymentTransactionPage() {
  const { total, items, clearCart } = useCartStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalAmount, setFinalAmount] = useState(total);
  const [orderNumber, setOrderNumber] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const runSteps = async () => {
      // Generate random order number
      setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());

      for (let i = 0; i < STEPS.length; i++) {
        await new Promise(resolve => {
          timeout = setTimeout(() => {
            setCurrentStep(i);
            resolve(null);
          }, STEPS[i].duration);
        });
      }
      
      // Complete animation
      timeout = setTimeout(() => {
        setIsComplete(true);
        handlePrintReceipt(); // İşlem tamamlandığında yazdırma işlemini başlat
      }, 1000);
    };

    runSteps();

    return () => clearTimeout(timeout);
  }, []);

  // Ana menüye dönüş fonksiyonu
  const handleReturnToMenu = () => {
    clearCart();
    router.push('/menu');
  };

  // Yazdırma işlemi
  const handlePrintReceipt = async () => {
    if (isPrinting || !items.length) return;
    
    setIsPrinting(true);
    try {
      const receipt = printService.generateReceipt(items, total);
      const success = await printService.print(receipt);
      
      if (!success) {
        // Elastic ortamında değilse veya yazdırma başarısız olduysa sessizce devam et
        // Kullanıcı deneyimini bozmamak için hata göstermeye gerek yok
        console.warn('Printing is only available in Elastic environment');
      }
    } catch (error) {
      console.warn('Print failed:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  // İşlem tamamlandığında sepeti temizle
  useEffect(() => {
    if (isComplete) {
      clearCart();
    }
  }, [isComplete, clearCart]);
  
  return (
    <div className="min-h-screen bg-[url('/patterns/topography.svg')] bg-fixed">
      <div className="min-h-screen backdrop-blur-xl bg-gradient-to-b from-background/95 via-background/80 to-background/95">
        <div className="container mx-auto px-4 py-8 max-w-3xl min-h-screen flex flex-col">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 group relative z-10"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Geri Dön
            </Button>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md mx-auto relative">
              <AnimatePresence mode="wait">
                {!isComplete ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/20"
                  >
                    {/* Processing Animation */}
                    <div className="relative w-48 h-48 mx-auto">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full h-full"
                      >
                        <img
                          src="/img/animations/pay-animation.gif"
                          alt="Payment Processing"
                          className="w-full h-full object-contain filter drop-shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      </motion.div>
                    </div>

                    {/* Amount Display */}
                    <div className="text-center space-y-2 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="text-3xl font-bold text-primary">₺ {finalAmount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground font-medium">İşleminiz Gerçekleştiriliyor</div>
                    </div>

                    {/* Steps Progress */}
                    <div className="space-y-6 relative">
                      <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-muted/50" />
                      {STEPS.map((step, index) => (
                        <motion.div
                          key={step.id}
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: currentStep >= index ? 1 : 0.5,
                            x: 0
                          }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <div className="flex items-center gap-4 pl-10">
                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                              currentStep >= index 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                : 'bg-muted'
                            }`}>
                              {currentStep > index ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", bounce: 0.5 }}
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </motion.div>
                              ) : (
                                <span>{step.id}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{step.title}</div>
                              {currentStep === index && (
                                <motion.div
                                  className="h-1 bg-primary/10 mt-2 rounded-full overflow-hidden"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-primary/60 to-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ 
                                      duration: STEPS[index].duration / 1000,
                                      ease: "linear"
                                    }}
                                  />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/20"
                  >
                    {/* Success Animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto flex items-center justify-center backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                        className="bg-primary/10 p-4 rounded-full"
                      >
                        <CheckCircle2 className="w-16 h-16 text-primary" />
                      </motion.div>
                    </motion.div>

                    {/* Success Message */}
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        İşlem Başarılı
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        Ödemeniz başarıyla tamamlandı
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sipariş No: #{orderNumber}
                      </p>
                    </div>

                    {/* Amount Confirmation */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 space-y-2">
                      <div className="text-sm text-muted-foreground font-medium">Ödenen Tutar</div>
                      <div className="text-4xl font-bold text-primary">₺ {finalAmount.toFixed(2)}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Print Button - Only show in Elastic environment */}
                      {isElastic() && (
                        <Button
                          className="w-full h-12 text-lg font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                          onClick={handlePrintReceipt}
                          disabled={isPrinting}
                        >
                          {isPrinting ? 'Yazdırılıyor...' : 'Fişi Yazdır'}
                        </Button>
                      )}

                      {/* Return Button */}
                      <Button
                        className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
                        onClick={handleReturnToMenu}
                      >
                        Menüye Dön
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
