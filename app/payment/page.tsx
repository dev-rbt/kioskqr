"use client";

import { useCartStore } from '@/store/cart';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ArrowLeft, 
  CreditCardIcon,
  Banknote,
  CircleDollarSign,
  Contact,
  Wallet,
  Receipt,
  Store
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/payment/currency-display';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cards = [
  { name: "Mastercard", icon: <CreditCard className="w-8 h-8 text-white" /> },
  { name: "Visa", icon: <CreditCardIcon className="w-8 h-8 text-white" /> },
  { name: "Troy", icon: <CreditCard className="w-8 h-8 text-white" /> }
];

const foodCards = [
  { name: "Sodexo", icon: <Wallet className="w-8 h-8 text-white" /> },
  { name: "Multinet", icon: <Receipt className="w-8 h-8 text-white" /> },
  { name: "Setcard", icon: <Store className="w-8 h-8 text-white" /> }
];

export default function PaymentPage() {
  const { total } = useCartStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[url('/patterns/topography.svg')] bg-fixed">
      <div className="min-h-screen backdrop-blur-xl bg-gradient-to-b from-background/95 via-background/80 to-background/95">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-64 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-64 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-5 bg-center" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Back Button */}
            <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2 group relative z-10 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Geri Dön
              </Button>
            </motion.div>

            {/* Header with 3D Effect */}
            <motion.div 
              variants={itemVariants} 
              className="text-center space-y-4 relative"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                initial={{ rotateX: -30, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
              >
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent pb-3">
                  Ödeme Yöntemi
                </h1>
                <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
                <p className="text-muted-foreground mt-4 text-lg">Tercih ettiğiniz ödeme yöntemini seçin</p>
              </motion.div>
            </motion.div>

            {/* Amount Display Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10" />
                
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary/90" />
                
                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>
                
                {/* Content */}
                <div className="relative p-10">
                  <div className="text-center">
                    {/* Amount Section */}
                    <div className="text-white space-y-6">
                      <div className="text-white/90 text-lg font-medium uppercase tracking-wider">Ödenecek Tutar</div>
                      <div className="text-7xl font-bold tracking-tighter flex items-start justify-center">
                        <span className="text-4xl mt-2">₺</span>
                        <span className="ml-2">{total.toFixed(2)}</span>
                      </div>
                      <CurrencyDisplay amount={total} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Options */}
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              {/* Credit Card Option */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.03, translateY: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                onClick={() => router.push('/payment/transaction')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-xl">
                  {/* Card Content */}
                  <div className="p-8">
                    <div className="flex flex-col items-start gap-6">
                      {/* Header */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <CreditCardIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">Kredi Kartı</h3>
                          <p className="text-white/90 text-lg">Tüm kartlar desteklenir</p>
                        </div>
                      </div>

                      {/* Card Logos */}
                      <div className="flex gap-6 items-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl w-full justify-around">
                        {cards.map((card, index) => (
                          <motion.div
                            key={card.name}
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                              {card.icon}
                            </div>
                            <span className="text-white/80 text-sm">{card.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>

              {/* Food Card Option */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.03, translateY: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-xl">
                  {/* Card Content */}
                  <div className="p-8">
                    <div className="flex flex-col items-start gap-6">
                      {/* Header */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Banknote className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">Yemek Kartı</h3>
                          <p className="text-white/90 text-lg">Tüm yemek kartları geçerli</p>
                        </div>
                      </div>

                      {/* Card Logos */}
                      <div className="flex gap-6 items-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl w-full justify-around">
                        {foodCards.map((card, index) => (
                          <motion.div
                            key={card.name}
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                              {card.icon}
                            </div>
                            <span className="text-white/80 text-sm">{card.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
