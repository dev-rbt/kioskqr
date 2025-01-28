"use client";

import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard as CreditCardIcon,
  Banknote,
  CircleDollarSign,
  Wallet,
  Receipt,
  Store,
  ShoppingCart,
  Smartphone,
  StickyNote,
  ChevronRight
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useRef, useCallback, useEffect } from 'react';
import useBranchStore from '@/store/branch';
import { PaymentMethod } from '@/types/branch';
import { useKeyboardStore } from '@/components/ui/virtual-keyboard';
import { PaymentHeader } from '@/components/payment/payment-header';
import { PaymentSteps } from '@/components/payment/payment-steps';
import { OrderNotes } from '@/components/payment/steps/order-notes';
import { DeviceNumber } from '@/components/payment/steps/device-number';
import { PaymentMethod as PaymentMethodStep } from '@/components/payment/steps/payment-method';

const paymentMethodIcons: Record<string, JSX.Element> = {
  CREDIT_CARD: <CreditCardIcon className="w-8 h-8" />,
  MEAL_CARD: <Banknote className="w-8 h-8" />,
  SODEXO: <Wallet className="w-8 h-8" />,
  MULTINET: <Receipt className="w-8 h-8" />,
  SETCARD: <Store className="w-8 h-8" />
};

const steps = [
  { icon: StickyNote, label: 'Sipariş Notu' },
  { icon: Smartphone, label: 'Cihaz No' },
  { icon: CreditCardIcon, label: 'Ödeme' }
];

export default function PaymentPage() {
  const { cart, updateCart } = useCartStore();
  const { branchData, t } = useBranchStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { setInputRef, setIsOpen } = useKeyboardStore();
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  // Handle step changes from URL parameter
  useEffect(() => {
    const stepNumber = searchParams?.get('stepNumber');
    if (stepNumber) {
      const newStep = parseInt(stepNumber);
      if (newStep >= 1 && newStep <= 3) {
        setStep(newStep);
        // Close keyboard when not on step 1
        if (newStep !== 1) {
          setIsOpen(false);
        }
      }
    }
  }, [searchParams, setIsOpen]);

  // Auto focus and open keyboard when component mounts or when returning to step 1
  useEffect(() => {
    if (step === 1 && noteInputRef.current) {
      noteInputRef.current.value = cart.Notes || '';
      noteInputRef.current.focus();
      setInputRef(noteInputRef.current);
      setIsOpen(true);
    }
  }, [setInputRef, setIsOpen, cart.Notes, step]);

  const handleFocus = useCallback(() => {
    if (noteInputRef.current) {
      setInputRef(noteInputRef.current);
      setIsOpen(true);
    }
  }, [setInputRef, setIsOpen]);

  const updateStepAndUrl = useCallback((newStep: number) => {
    setStep(newStep);
    const params = new URLSearchParams(window.location.search);
    params.set('stepNumber', newStep.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [router]);

  const handleNextStep = useCallback(() => {
    if (noteInputRef.current) {
      updateCart({ Notes: noteInputRef.current.value });
    }
    setIsOpen(false);
    updateStepAndUrl(2);
  }, [updateCart, setIsOpen, updateStepAndUrl]);

  const handleDeviceNumberChange = async (digit: string) => {
    if (digit === 'delete') {
      await updateCart({ CallNumber: cart.CallNumber?.slice(0, -1) });
      setError('');
    } else {
      const newNumber = (cart.CallNumber || '') + digit;
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
    updateStepAndUrl(3);
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
      <div className="main-content">
        {/* Background Patterns */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-[0.02]" />
          <div className="absolute top-0 -right-64 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-32 -left-64 w-[50rem] h-[50rem] bg-gradient-to-tr from-primary/10 to-primary/5 rounded-full blur-3xl opacity-30" />
        </div>

        {/* Header */}
        <PaymentHeader
          totalAmount={cart.AmountDue}
          progress={(step / 3) * 100}
          onBack={() => router.back()}
          t={t}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Progress Steps */}
          <PaymentSteps
            steps={steps}
            currentStep={step}
            t={t}
          />

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <OrderNotes
                onNext={handleNextStep}
                onFocus={handleFocus}
                noteInputRef={noteInputRef}
                t={t}
              />
            ) : step === 2 ? (
              <DeviceNumber
                callNumber={cart.CallNumber || ''}
                error={error}
                onDigitPress={handleDeviceNumberChange}
                onSubmit={handleDeviceNumberSubmit}
                t={t}
              />
            ) : (
              <PaymentMethodStep
                notes={cart.Notes || ''}
                callNumber={cart.CallNumber || ''}
                paymentMethods={branchData?.PaymentMethods || []}
                onSelect={handlePaymentMethodSelect}
                t={t}
                paymentMethodIcons={paymentMethodIcons}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}