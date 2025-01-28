"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';

interface OrderNotesProps {
  onNext: () => void;
  onFocus: () => void;
  noteInputRef: React.RefObject<HTMLTextAreaElement>;
  t: any;
}

export function OrderNotes({ onNext, onFocus, noteInputRef, t }: OrderNotesProps) {
  return (
    <motion.div
      key="notes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <StickyNote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.common.orderNotes}</h2>
            <p className="text-sm text-gray-500">{t.common.enterOrderNotes}</p>
          </div>
        </div>

        <textarea
          ref={noteInputRef}
          onFocus={onFocus}
          placeholder={t.common.enterOrderNotes}
          className="w-full min-h-[150px] p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />

        <Button
          onClick={onNext}
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
        >
          {t.common.nextButton}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}