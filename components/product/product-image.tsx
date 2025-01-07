interface ProductImageProps {
  image: string;
  name: string;
}

export function ProductImage({ image, name }: ProductImageProps) {
  return (
    <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group">
      <img
        src={image}
        alt={name}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
}
