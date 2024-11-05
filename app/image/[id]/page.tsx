import ImageDialog from "@/app/components/ImageDialog";
import { images } from "@/app/components/ImageGallery";
import { notFound } from "next/navigation";

export default function ImagePage({ params }: { params: { id: string } }) {
  const image = images.find((img) => img.id === params.id);

  if (!image) {
    notFound();
  }

  return <ImageDialog image={image} />;
}
