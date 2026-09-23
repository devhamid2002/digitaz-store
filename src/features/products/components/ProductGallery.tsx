import Image from "next/image";

interface ProductGalleryProps {
  image: string;
  name: string;
}

// Shaped as a Swiper slide viewport to allow a main + thumbs layout later
export default function ProductGallery({ image, name }: ProductGalleryProps) {
  return (
    <div className="w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
