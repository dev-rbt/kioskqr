"use client";

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bir Hata Oluştu</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Lütfen daha sonra tekrar deneyin
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Tekrar Dene
        </Button>
      </div>
    </div>
  );
}
