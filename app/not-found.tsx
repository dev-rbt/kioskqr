import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Aradığınız sayfa bulunamadı
        </p>
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
