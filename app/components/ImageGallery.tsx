import InfiniteImageGrid from './InfiniteImageGrid';

export interface ImageType {
  id: string;
  url: string;
  title: string;
}

export const images: ImageType[] = [
  { id: "1", url: "https://picsum.photos/id/1/800/600", title: "Image 1" },
  { id: "2", url: "https://picsum.photos/id/112/800/600", title: "Image 2" },
  { id: "3", url: "https://picsum.photos/id/128/800/600", title: "Image 3" },
  { id: "4", url: "https://picsum.photos/id/254/800/600", title: "Image 4" },
  { id: "5", url: "https://picsum.photos/id/515/800/600", title: "Image 5" },
  { id: "6", url: "https://picsum.photos/id/166/800/600", title: "Image 6" },
  { id: "7", url: "https://picsum.photos/id/72/800/600", title: "Image 7" },
  { id: "8", url: "https://picsum.photos/id/38/800/600", title: "Image 8" },
  { id: "9", url: "https://picsum.photos/id/129/800/600", title: "Image 9" },
  { id: "10", url: "https://picsum.photos/id/160/800/600", title: "Image 10" },
  { id: "11", url: "https://picsum.photos/id/16/800/600", title: "Image 11" },
  { id: "12", url: "https://picsum.photos/id/722/800/600", title: "Image 12" },
  { id: "13", url: "https://picsum.photos/id/123/800/600", title: "Image 13" },
  { id: "14", url: "https://picsum.photos/id/421/800/600", title: "Image 14" },
  { id: "15", url: "https://picsum.photos/id/521/800/600", title: "Image 15" },
];

export default function ImageGallery() {
  return (
    <div className="relative">
      <InfiniteImageGrid images={images} />
    </div>
  );
}
