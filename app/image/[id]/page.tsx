import ImageDialog from "@/app/components/ImageDialog";
import { images } from "@/app/components/ImageGallery";
import { notFound } from "next/navigation";

export default function ImagePage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  console.log(searchParams); // searchParams
  const image = images.find((img) => img.id === params.id);

  if (!image) {
    notFound();
  }

  return <ImageDialog image={image} searchParams={searchParams} />;
}
