"use client";

import { motion } from 'framer-motion';
import { Check, Clock, CheckCircle2 } from 'lucide-react';

export function PaymentProgress() {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-muted" />
      <div className="relative flex justify-between">
        <Step
          icon={Check}
          label="Sipariş Kaydedildi"
          sublabel="12587"
          status="completed"
        />
        <Step
          icon={Clock}
          label="Ödeme Bekleniyor"
          status="current"
        />
        <Step
          icon={CheckCircle2}
          label="Tamamlandı"
          status="pending"
        />
      </div>
    </div>
  );
}

function Step({ 
  icon: Icon, 
  label, 
  sublabel, 
  status 
}: { 
  icon: any;
  label: string;
  sublabel?: string;
  status: 'completed' | 'current' | 'pending';
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${status === 'completed' ? 'bg-green-500 text-white' :
          status === 'current' ? 'bg-orange-500 text-white' :
          'bg-muted text-muted-foreground'}
      `}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">{label}</div>
        {sublabel && (
          <div className="text-xs text-muted-foreground">{sublabel}</div>
        )}
      </div>
    </motion.div>
  );
}
