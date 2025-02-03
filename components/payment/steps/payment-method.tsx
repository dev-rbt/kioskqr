"use client";

import { motion } from 'framer-motion';
import { CreditCard, StickyNote, Smartphone, Wallet, ChevronRight, CircleDollarSign } from 'lucide-react';
import { PaymentMethod as PaymentMethodType } from '@/types/branch';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

// Move PaymentMethodCard outside the main component
const PaymentMethodCard = ({ 
  method, 
  onClick,
  paymentMethodIcons 
}: { 
  method: PaymentMethodType; 
  onClick: (method: PaymentMethodType) => void;
  paymentMethodIcons: Record<string, JSX.Element>;
}) => {
  const handleClick = useCallback(() => {
    onClick(method);
  }, [method, onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full"
      >
        {/* Card content remains the same */}
        <div className="relative bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur group-hover:blur-md transition-all" />
              <div className="relative w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                {paymentMethodIcons[method.Type] || <CreditCard className="w-8 h-8 text-primary" />}
              </div>
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-primary group-hover:to-primary/80 bg-clip-text text-transparent transition-all duration-300 truncate">
                {method.PaymentName}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-primary/70 transition-colors truncate">
                {method.Name}
              </p>
            </div>

            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>
    </button>
  );
};

interface PaymentMethodProps {
  notes: string;
  callNumber: string;
  paymentMethods: PaymentMethodType[];
  onSelect: (method: PaymentMethodType) => void;
  t: any;
  paymentMethodIcons: Record<string, JSX.Element>;
}

export function PaymentMethod({ notes, callNumber, paymentMethods, onSelect, t, paymentMethodIcons }: PaymentMethodProps) {
  const router = useRouter();
  const { cart } = useCartStore();
  const params = useParams();
  
  const creditCardMethods = paymentMethods.filter(method => method.Type === 'CREDIT_CARD');
  const mealCardMethods = paymentMethods.filter(method => method.Type === 'MEAL_CARD');

  const handlePaymentMethodSelect = useCallback(async (method: PaymentMethodType) => {
    try {
      console.log('Payment method selected:', method);
      await onSelect(method);
      router.push(`/${params?.branchId}/payment/transaction`);
    } catch (error) {
      console.error('Error selecting payment method:', error);
    }
  }, [onSelect, router, params?.branchId]);

  const handleEditNotes = () => {
    router.push(`/${params?.branchId}/payment?stepNumber=1`);
  };

  const handleEditDeviceNumber = () => {
    router.push(`/${params?.branchId}/payment?stepNumber=2`);
  };

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Order Info and Amount */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Notes */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="group bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative cursor-pointer"
          onClick={handleEditNotes}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <StickyNote className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">{t.common.orderNotes}</p>
              <p className="text-sm font-medium truncate">
                {notes || t.common.noOrderNotes}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </motion.div>

        {/* Device Number */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="group bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative cursor-pointer"
          onClick={handleEditDeviceNumber}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{t.common.selectedDevice}</p>
              <p className="text-lg font-bold text-primary">{callNumber}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </motion.div>

        {/* Total Amount */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CircleDollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t.common.amountToPay}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ₺ {cart.AmountDue.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods Sections */}
      <div className="space-y-6">
        {/* Credit Cards Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kredi Kartı</h2>
              <p className="text-sm text-gray-500">Kredi kartı ile güvenli ödeme yapın</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditCardMethods.map((method) => (
              <PaymentMethodCard 
                key={method.PaymentMethodKey} 
                method={method} 
                onClick={handlePaymentMethodSelect}
                paymentMethodIcons={paymentMethodIcons}
              />
            ))}
          </div>
        </motion.div>

        {/* Meal Cards Section */}
        {/* <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Yemek Kartları</h2>
              <p className="text-sm text-gray-500">Yemek kartı ile hızlı ödeme yapın</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealCardMethods.map((method) => (
              <PaymentMethodCard 
                key={method.PaymentMethodKey} 
                method={method} 
                onClick={handlePaymentMethodSelect}
                paymentMethodIcons={paymentMethodIcons}
              />
            ))}
          </div>
        </motion.div> */}
      </div>
    </motion.div>
  );
}