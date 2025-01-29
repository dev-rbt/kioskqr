"use client";

interface ProductImageProps {
  imageUrl: string | undefined;
  alt: string | undefined;
}

export function ProductImage({ imageUrl, alt }: ProductImageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center bg-white">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}