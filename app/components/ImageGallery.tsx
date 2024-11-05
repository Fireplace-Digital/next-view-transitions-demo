import { Link } from "next-view-transitions";
import Image from "next/image";

export interface ImageType {
  id: string;
  url: string;
  title: string;
}

export const images: ImageType[] = [
  { id: "1", url: "https://picsum.photos/id/1/800/600", title: "Image 1" },
  { id: "2", url: "https://picsum.photos/id/2/800/600", title: "Image 2" },
  { id: "3", url: "https://picsum.photos/id/3/800/600", title: "Image 3" },
  { id: "4", url: "https://picsum.photos/id/4/800/600", title: "Image 4" },
  { id: "5", url: "https://picsum.photos/id/5/800/600", title: "Image 5" },
];

export default function ImageGallery() {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 p-4 hide-scrollbar">
        {images.map((image) => (
          <Link
            key={image.id}
            className="flex-shrink-0 cursor-pointer"
            href={`/image/${image.id}`}
          >
            <Image
              src={image.url}
              alt={image.title}
              width={300}
              height={200}
              className="rounded-lg hover:opacity-90 transition-opacity"
              style={{ viewTransitionName: `image-${image.id}` }}
              priority={parseInt(image.id) <= 2}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
