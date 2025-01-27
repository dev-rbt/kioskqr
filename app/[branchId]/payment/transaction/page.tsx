"use client";

import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CefSharpMessageType } from '@/types/cefsharp.d';
import { useEffect, useState } from 'react';
import { Translation } from '@/lib/i18n';
import useBranchStore from '@/store/branch';
import { useTimer } from '@/contexts/timer-context';

const PaymentSuccess = ({ amount, onReturn, t }: { amount: number; onReturn: () => void, t: Translation }) => {

  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4 text-center"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t.common.paymentCompleted}</h2>
        <p className="text-muted-foreground">{amount} TL</p>
      </div>
      <Button onClick={onReturn} className="gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {t.common.returnToMenu}
      </Button>
    </motion.div>
  );
};

const PaymentPending = ({ amount,t  }: { amount: number; t: Translation }) => (
  <motion.div
    key="pending"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/20"
  >
    <div className="text-center space-y-2 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
      <div className="text-3xl font-bold text-primary">₺ {amount.toFixed(2)}</div>
      <div className="text-sm text-muted-foreground font-medium">{t.common.paymentPending}...</div>
    </div>
  </motion.div>
);

const PaymentPrinting = ({ amount,t  }: { amount: number; t: Translation }) => (
  <motion.div
    key="printing"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/20"
  >
    <div className="text-center space-y-2 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
      <div className="text-3xl font-bold text-primary">₺ {amount.toFixed(2)}</div>
      <div className="text-sm text-muted-foreground font-medium">{t.common.paymentPrinting}...</div>
    </div>
  </motion.div>
);

const PaymentConnecting = ({ amount, t }: { amount: number; t: Translation }) => (
  <motion.div
    key="connecting"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/20"
  >
    <div className="text-center space-y-2 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
      <div className="text-3xl font-bold text-primary">₺ {amount.toFixed(2)}</div>
      <div className="text-sm text-muted-foreground font-medium">{t.common.paymentConnecting}...</div>
    </div>
  </motion.div>
);

const Error = ({ amount, error, onRetry, onCancel, onChangePaymentMethod, t }: {
  amount: number;
  error: string;
  onRetry?: () => void;
  onCancel?: () => void;
  onChangePaymentMethod?: () => void;
  t: Translation
}) => (
  <motion.div
    key="error"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/20"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <X className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold text-primary">₺ {amount.toFixed(2)}</div>
        <div className="text-sm text-destructive font-medium">{error}</div>
      </div>
    </div>
    <div className="flex flex-col gap-3">
      {onRetry && (
        <Button onClick={onRetry} className="gap-2 bg-primary hover:bg-primary/90">
          {t.common.retry}
        </Button>
      )}
      {onCancel && (  
        <Button onClick={onCancel} variant="outline" className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
          {t.common.cancelOrder}
        </Button>
      )}
      {onChangePaymentMethod && (
        <Button
          onClick={onChangePaymentMethod}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          {t.common.changePaymentMethod}
        </Button>
      )}
    </div>
  </motion.div>
);

export default function PaymentTransactionPage() {
  const { cart, clearCart } = useCartStore();
  const { t } = useBranchStore();
  const router = useRouter();
  const params = useParams();
  const [cefSharpMessage, setCefSharpMessage] = useState<{ Type: CefSharpMessageType, Code: string, Arg: string } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper function to replace template variables in error messages
  const replaceTemplateVariables = (template: string, args: string) => {
    return template.replace(/\${(\w+)}/g, () => args);
  };

  useEffect(() => {
    const updatedCart = useCartStore.getState().cart;
    const cefSharpMessageHandler = (Type: CefSharpMessageType, Code: string, Arg: string) => {
      console.log(updatedCart)
      console.log({ Type, Code, Arg })
      setCefSharpMessage({ Type, Code, Arg });
      setIsRetrying(false);
    };

    if (typeof window !== 'undefined') {
      (window as Window).handleCefSharpMessage = cefSharpMessageHandler;
    }
    try {
      if (typeof window !== 'undefined' && 'CefSharp' in window) {
        window.CefSharp.PostMessage({ saveOrder: updatedCart });
      } else {
        console.warn("CefSharp bulunamadı - tarayıcı ortamında çalışıyor olabilir");
      }
    } catch (error) {
      console.error("CefSharp iletişim hatası:", error);
    }
    return () => {
      if (typeof window !== 'undefined') {
        (window as Window).handleCefSharpMessage = () => '';
      }
    };

  }, []);

  // Ana menüye dönüş fonksiyonu
  const handleReturnToMenu = () => {
    clearCart();
    router.push(`/${params?.branchId}/menu`);
  };


  // Ödemeye fonksiyonu
  const handlePaymentMenu = () => {
    router.push(`/${params?.branchId}/payment?stepNumber=3`);
  };
  

  // Yeniden deneme fonksiyonu
  const handleRetry = () => {
    setIsRetrying(true);

    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && 'CefSharp' in window) {
          window.CefSharp.PostMessage({ saveOrder: cart });
        }
      } catch (error) {
        console.error("CefSharp iletişim hatası:", error);
        setIsRetrying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[url('/patterns/topography.svg')] bg-fixed">
      <div className="min-h-screen backdrop-blur-xl bg-gradient-to-b from-background/95 via-background/80 to-background/95">
        <div className="container mx-auto px-4 py-8 max-w-3xl min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md mx-auto relative">
              <AnimatePresence mode="wait">
                {(() => {
                  if (isRetrying || !cefSharpMessage) {
                    return <PaymentConnecting amount={cart.AmountDue} t={t}/>;
                  }

                  // Get error message from translations if code exists
                  const errorMessage = cefSharpMessage.Code && cefSharpMessage.Code in t.errors
                    ? replaceTemplateVariables(t.errors[cefSharpMessage.Code as keyof typeof t.errors], cefSharpMessage.Arg)
                    : cefSharpMessage.Arg;

                  switch (cefSharpMessage.Type) {
                    case CefSharpMessageType.PAYMENT_SUCCESS:
                      return <PaymentSuccess amount={cart.AmountDue} onReturn={handleReturnToMenu} t={t} />;
                    case CefSharpMessageType.PAYMENT_PENDING:
                      return <PaymentPending amount={cart.AmountDue} t={t} />;
                    case CefSharpMessageType.PAYMENT_PRINTING:
                      return <PaymentPrinting amount={cart.AmountDue} t={t} />;
                    case CefSharpMessageType.VALIDATION_ERROR:
                      return (
                        <Error
                          amount={cart.AmountDue}
                          error={errorMessage}
                          onRetry={handleRetry}
                          onCancel={handleReturnToMenu}
                          onChangePaymentMethod={handlePaymentMenu}
                          t={t}
                        />
                      );
                    case CefSharpMessageType.PAYMENT_ERROR:
                      return <Error
                        amount={cart.AmountDue}
                        error={errorMessage}
                        onRetry={handleRetry}
                        onCancel={handleReturnToMenu}
                        onChangePaymentMethod={handlePaymentMenu}
                        t={t}
                      />;
                    case CefSharpMessageType.ORDER_SAVE_ERROR:
                      return <Error
                        amount={cart.AmountDue}
                        error={errorMessage}
                        onRetry={handleRetry}
                        onCancel={handleReturnToMenu}
                        onChangePaymentMethod={handlePaymentMenu}
                        t={t}
                      />;
                    case CefSharpMessageType.ECR_ERROR:
                        return <Error
                          amount={cart.AmountDue}
                          error={errorMessage}
                          onRetry={handleRetry}
                          onCancel={handleReturnToMenu}
                          onChangePaymentMethod={handlePaymentMenu}
                          t={t}
                        />;
                    case CefSharpMessageType.ACTION_RESPONSE:
                      return <Error
                        amount={cart.AmountDue}
                        error={errorMessage}
                        onRetry={handleRetry}
                        onCancel={handleReturnToMenu}
                        onChangePaymentMethod={handlePaymentMenu}
                        t={t}
                      />;
                    default:
                      return null;
                  }
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
