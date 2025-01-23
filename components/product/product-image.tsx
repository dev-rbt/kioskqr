interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
}
