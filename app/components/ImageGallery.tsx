import InfiniteImageGrid from './InfiniteImageGrid';

export interface ImageType {
  id: string;
  url: string;
  title: string;
}

export const images: ImageType[] = [
  { id: "1", url: "https://picsum.photos/id/1/800/600", title: "Wanderlust" },
  { id: "2", url: "https://picsum.photos/id/112/800/600", title: "Urban Rhythm" },
  { id: "3", url: "https://picsum.photos/id/128/800/600", title: "Nature's Canvas" },
  { id: "4", url: "https://picsum.photos/id/254/800/600", title: "Digital Dreams" },
  { id: "5", url: "https://picsum.photos/id/515/800/600", title: "Neon Nights" },
  { id: "6", url: "https://picsum.photos/id/166/800/600", title: "Pixel Perfect" },
  { id: "7", url: "https://picsum.photos/id/72/800/600", title: "Abstract Thoughts" },
  { id: "8", url: "https://picsum.photos/id/38/800/600", title: "Minimal Moments" },
  { id: "9", url: "https://picsum.photos/id/129/800/600", title: "Color Theory" },
  { id: "10", url: "https://picsum.photos/id/160/800/600", title: "Design Systems" },
  { id: "11", url: "https://picsum.photos/id/16/800/600", title: "Visual Language" },
  { id: "12", url: "https://picsum.photos/id/722/800/600", title: "Creative Flow" },
  { id: "13", url: "https://picsum.photos/id/123/800/600", title: "Interface Poetry" },
  { id: "14", url: "https://picsum.photos/id/421/800/600", title: "Digital Garden" },
  { id: "15", url: "https://picsum.photos/id/521/800/600", title: "Future Forms" },
];

export default function ImageGallery() {
  return (
    <div className="relative">
      <InfiniteImageGrid images={images} />
    </div>
  );
}
