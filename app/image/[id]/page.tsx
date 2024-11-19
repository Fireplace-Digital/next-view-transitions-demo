import ImageDialog from "@/app/components/ImageDialog";
import { images } from "@/app/components/ImageGallery";
import { notFound } from "next/navigation";

export default function ImagePage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const currentIndex = images.findIndex((img) => img.id === params.id);
  const positionIndex = parseInt(searchParams.p as string) || 0;

  if (currentIndex === -1) {
    notFound();
  }

  const image = images[currentIndex];
  const imagesPerRow = 9; // This should match the value in InfiniteImageGrid

  // Calculate previous and next indices with wrapping
  const previousIndex = (positionIndex - 1 + images.length) % images.length;
  const nextIndex = (positionIndex + 1) % images.length;

  const previousImage = images[previousIndex];
  const nextImage = images[nextIndex];

  // Calculate grid positions for previous and next images
  const previousImageParams = {
    r: Math.floor(previousIndex / imagesPerRow),
    c: previousIndex % imagesPerRow,
    p: previousIndex
  };

  const nextImageParams = {
    r: Math.floor(nextIndex / imagesPerRow),
    c: nextIndex % imagesPerRow,
    p: nextIndex
  };

  return (
    <ImageDialog
      image={image}
      searchParams={searchParams}
      previousImageId={previousImage.id}
      nextImageId={nextImage.id}
      previousImageParams={previousImageParams}
      nextImageParams={nextImageParams}
      position={{ r: Math.floor(positionIndex / imagesPerRow), c: positionIndex % imagesPerRow }}
    />
  );
}
