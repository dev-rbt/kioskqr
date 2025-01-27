"use client";

import { useCartStore } from '@/store/cart';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CreditCardIcon,
  Banknote,
  CircleDollarSign,
  Wallet,
  Receipt,
  Store,
  ShoppingCart,
  Smartphone
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/payment/currency-display';
import { useState, useRef, useCallback, useEffect } from 'react';
import useBranchStore from '@/store/branch';
import { PaymentMethod } from '@/types/branch';
import { useKeyboardStore } from '@/components/ui/virtual-keyboard';

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

const paymentMethodIcons: { [key: string]: JSX.Element } = {
  CREDIT_CARD: <CreditCardIcon className="w-8 h-8" />,
  MEAL_CARD: <Banknote className="w-8 h-8" />,
  SODEXO: <Wallet className="w-8 h-8" />,
  MULTINET: <Receipt className="w-8 h-8" />,
  SETCARD: <Store className="w-8 h-8" />
};

export default function PaymentPage() {
  const { cart, updateCart } = useCartStore();
  const { branchData, t } = useBranchStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = searchParams?.get('stepNumber') ? parseInt(searchParams.get('stepNumber')!) : 1;
  const [step, setStep] = useState(initialStep);
  const [error, setError] = useState('');
  const { setInputRef, setIsOpen, inputRef } = useKeyboardStore();
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (noteInputRef.current) {
      noteInputRef.current.value = cart.Notes || '';
      setInputRef(noteInputRef.current);
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (noteInputRef.current) {
      setInputRef(noteInputRef.current);
      setIsOpen(true);
    }
  }, [setInputRef, setIsOpen]);

  const handleNextStep = useCallback(() => {
    if (noteInputRef.current) {
      updateCart({ Notes: noteInputRef.current.value });
    }
    setStep(2);
  }, [updateCart]);

  const handleDeviceNumberChange = async (digit: string) => {
    if (digit === 'delete') {
      await updateCart({ CallNumber: cart.CallNumber?.slice(0, -1) });
      setError('');
    } else {
      const newNumber = cart.CallNumber + digit;
      if (newNumber === '0') {
        setError(t.common.deviceNumberZeroError);
        return;
      }
      const strippedNumber = newNumber.replace(/^0+/, '');
      await updateCart({ CallNumber: strippedNumber });
      setError('');
    }
  };

  const handleDeviceNumberSubmit = () => {
    if (!cart.CallNumber) {
      setError(t.common.enterDeviceNumberWarning);
      return;
    }
    setError('');
    setStep(3);
  };

  const handlePaymentMethodSelect = async (paymentMethod: PaymentMethod) => {
    await updateCart({
      Notes: cart.Notes,
      PaymentType: paymentMethod.Type as 'CREDIT_CARD' | 'MEAL_CARD',
      PaymentMethod: {
        Key: paymentMethod.PaymentMethodKey,
        PaymentMethodID: paymentMethod.PaymentMethodID,
        PaymentName: paymentMethod.PaymentName,
        Name: paymentMethod.Name,
        Type: paymentMethod.Type as 'CREDIT_CARD' | 'MEAL_CARD'
      }
    });
    router.push('transaction');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="min-h-screen">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-64 w-[40rem] h-[40rem] bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-32 -left-64 w-[50rem] h-[50rem] bg-gradient-to-tr from-emerald-50 to-teal-100 rounded-full blur-3xl opacity-30" />
        </div>

        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
              className="gap-2 group hover:bg-emerald-50 text-gray-700 transition-all rounded-xl text-lg"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t.common.backToCart}
            </Button>

            {/* Amount Display */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-2.5 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">{t.common.totalAmount}</span>
                <div className="flex items-baseline gap-1 font-bold">
                  <span className="text-emerald-600 text-lg">₺</span>
                  <span className="text-2xl text-gray-900">{cart.AmountDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12 max-w-6xl relative">
          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="h-1 bg-gray-200 rounded-full">
                <div
                  className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                />
              </div>
              <div className="flex justify-between -mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex flex-col items-center group cursor-pointer transition-all"
                >
                  <div className={`w-4 h-4 rounded-full transition-colors ${step >= 1 ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                  <span className={`text-sm font-medium mt-2 transition-colors ${step >= 1 ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-gray-600 group-hover:text-gray-700'}`}>
                    {t.common.orderNotes}
                  </span>
                </button>
                <button
                  onClick={() => cart.Notes && setStep(2)}
                  className={`flex flex-col items-center transition-all ${cart.Notes ? 'cursor-pointer group' : 'cursor-not-allowed opacity-50'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-colors ${step >= 2 ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                  <span className={`text-sm font-medium mt-2 transition-colors ${step >= 2 ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-gray-600 group-hover:text-gray-700'}`}>
                    {t.common.selectedDevice}
                  </span>
                </button>
                <button
                  onClick={() => cart.Notes && cart.CallNumber && setStep(3)}
                  className={`flex flex-col items-center transition-all ${cart.Notes && cart.CallNumber ? 'cursor-pointer group' : 'cursor-not-allowed opacity-50'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-colors ${step >= 3 ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                  <span className={`text-sm font-medium mt-2 transition-colors ${step >= 3 ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-gray-600 group-hover:text-gray-700'}`}>
                    {t.common.paymentMethod}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {step === 1 ? (
              // Step 1: Order Notes Input
              <motion.div
                variants={itemVariants}
                className="max-w-lg mx-auto text-center space-y-8"
              >
                <div className="space-y-4">
                  <span className="text-emerald-600 font-medium text-lg">{t.common.step} 1/3</span>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {t.common.orderNotes}
                  </h1>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Receipt className="w-10 h-10 text-white" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="note" className="text-sm font-medium">{t.common.orderNotes}</label>
                    <textarea
                      id="note"
                      defaultValue={cart.Notes}
                      value={cart.Notes}
                      onFocus={handleFocus}
                      ref={noteInputRef}
                      placeholder={t.common.orderNotes}
                      className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    onClick={handleNextStep}
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl gap-2"
                  >
                    {t.common.nextButton}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ) : step === 2 ? (
              // Step 2: Device Number Input
              <motion.div
                variants={itemVariants}
                className="max-w-lg mx-auto text-center space-y-8"
              >
                <div className="space-y-4">
                  <span className="text-emerald-600 font-medium text-lg">{t.common.step} 2/3</span>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {t.common.selectDeviceNumber}
                  </h1>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-center text-3xl font-bold text-gray-900 h-14 leading-[3.5rem]">
                        {cart.CallNumber || '____'}
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'delete', 0].map((digit, index) => (
                        <Button
                          key={digit}
                          onClick={async () => await handleDeviceNumberChange(digit.toString())}
                          className={`h-14 text-2xl font-semibold ${digit === 'delete'
                            ? 'bg-red-500 hover:bg-red-600 text-white col-span-1'
                            : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                            } rounded-xl`}
                          style={{
                            gridColumn: digit === 0 ? '2' : 'auto'
                          }}
                        >
                          {digit === 'delete' ? '⌫' : digit}
                        </Button>
                      ))}
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleDeviceNumberSubmit}
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl gap-2"
                  >
                    {t.common.nextButton}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Step 3: Payment Method Selection
              <>
                <div className="max-w-lg mx-auto space-y-4">
                  {/* Order Notes Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-600 text-sm">{t.common.orderNotes}</p>
                          <p className="text-xl font-bold text-gray-900 break-words line-clamp-2">
                            {cart.Notes || t.common.noOrderNotes}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStep(1);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 flex-shrink-0"
                      >
                        {t.common.edit}
                      </Button>
                    </div>
                  </motion.div>

                  {/* Device Number Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">{t.common.selectedDevice}</p>
                          <p className="text-xl font-bold text-gray-900">{cart.CallNumber}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateCart({ CallNumber: '' });
                          setStep(2);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        {t.common.edit}
                      </Button>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="text-center space-y-8"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                  >
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <span className="text-emerald-600 font-medium text-lg">{t.common.step} 3/3</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 pb-3">
                      {t.common.selectPaymentMethod}
                    </h1>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-6" />
                  </motion.div>

                  {/* Amount Card */}
                  <motion.div
                    variants={itemVariants}
                    className="max-w-lg mx-auto bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-gray-600 text-lg font-medium">{t.common.amountToPay}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-semibold text-emerald-600">₺</span>
                          <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {cart.AmountDue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg transform -rotate-6">
                        <CircleDollarSign className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <CurrencyDisplay amount={cart.AmountDue} />
                    </div>
                  </motion.div>

                  {/* Payment Methods Section */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent rounded-3xl -m-6" />
                    <motion.div
                      variants={itemVariants}
                      className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
                    >
                      {branchData?.PaymentMethods.map((method, index) => (
                        <motion.div
                          key={method.PaymentMethodKey}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, translateY: -5 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative group cursor-pointer"
                          onClick={() => handlePaymentMethodSelect(method)}
                        >
                          {/* Gradient Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-teal-50/20 to-emerald-100/30 rounded-2xl blur-2xl group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100" />

                          {/* Card */}
                          <div className="relative h-full overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            <div className="p-6">
                              <div className="flex items-center gap-5">
                                {/* Icon Container */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg transform -rotate-6 group-hover:rotate-0">
                                  <div className="text-white transition-transform">
                                    {paymentMethodIcons[method.Type] || <CreditCardIcon className="w-8 h-8" />}
                                  </div>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                    {method.PaymentName}
                                  </h3>
                                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors mt-1">
                                    {method.Name}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Decoration */}
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
