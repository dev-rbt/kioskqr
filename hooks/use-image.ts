import { useState, useEffect } from 'react';

interface UseImageProps {
  src: string;
  fallbackSrc?: string;
}

export const useImage = ({ src, fallbackSrc = '/images/placeholder.png' }: UseImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };

    img.onerror = (e) => {
      setImgSrc(fallbackSrc);
      setError(e as Error);
      setLoading(false);
    };
  }, [src, fallbackSrc]);

  return { imgSrc, error, loading };
};