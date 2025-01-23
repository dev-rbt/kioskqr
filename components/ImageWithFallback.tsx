import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export const ImageWithFallback = ({
  src,
  fallbackSrc = '/images/placeholder.png',
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      alt={alt}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};