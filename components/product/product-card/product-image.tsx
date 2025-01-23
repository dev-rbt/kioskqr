"use client";


interface ProductImageProps {
  imageUrl: string | undefined;
  alt: string | undefined;
}

export function ProductImage({ imageUrl, alt }: ProductImageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>
  );
}