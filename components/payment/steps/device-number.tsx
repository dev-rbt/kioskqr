"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeviceNumberProps {
  callNumber: string;
  error: string;
  onDigitPress: (digit: string) => void;
  onSubmit: () => void;
  t: any;
}

export function DeviceNumber({ callNumber, error, onDigitPress, onSubmit, t }: DeviceNumberProps) {
  return (
    <motion.div
      key="device"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.common.selectDeviceNumber}</h2>
            <p className="text-sm text-gray-500">{t.common.enterDeviceNumberWarning}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl text-center mb-6">
          <span className="text-4xl font-bold text-gray-900 font-mono">
            {callNumber || '____'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'delete', 0].map((digit, index) => (
            <Button
              key={digit}
              onClick={() => onDigitPress(digit.toString())}
              variant={digit === 'delete' ? 'destructive' : 'outline'}
              className={`h-16 text-2xl font-semibold ${
                digit === 'delete' ? 'col-span-1' : ''
              } ${digit === 0 ? 'col-start-2' : ''}`}
            >
              {digit === 'delete' ? '⌫' : digit}
            </Button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive mt-4">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={onSubmit}
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
        >
          {t.common.nextButton}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}