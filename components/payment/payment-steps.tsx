"use client";

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentStepsProps {
  steps: Array<{
    icon: any;
    label: string;
  }>;
  currentStep: number;
  t: any;
}

export function PaymentSteps({ steps, currentStep, t }: PaymentStepsProps) {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="flex justify-between mb-8">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentStep > index;
          const isCurrent = currentStep === index + 1;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-primary text-white' :
                isCurrent ? 'bg-primary/20 text-primary' :
                'bg-gray-100 text-gray-400'
              }`}>
                {isActive ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span className={`text-sm font-medium ${
                isActive || isCurrent ? 'text-primary' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}