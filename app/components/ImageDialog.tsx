"use client";
import Image from "next/image";
import { Link, useTransitionRouter } from "next-view-transitions";
import { ImageType } from "./ImageGallery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ImageDialogProps {
  image: ImageType;
  searchParams: { [key: string]: string | string[] | undefined };
  previousImageId: string;
  nextImageId: string;
  previousImageParams: { r: number; c: number; p: number };
  nextImageParams: { r: number; c: number; p: number };
  position: { r: number; c: number };
}

export default function ImageDialog({
  image,
  searchParams,
  previousImageId,
  nextImageId,
  previousImageParams,
  nextImageParams,
  position,
}: ImageDialogProps) {
  const router = useTransitionRouter();

  return (
    <Dialog defaultOpen>
      <DialogContent
        className="max-w-none w-screen h-screen p-0 border-none bg-black/95"
        onEscapeKeyDown={() => router.push("/")}
        onInteractOutside={() => router.push("/")}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <DialogClose asChild>
            <Link href="/" className="absolute right-6 top-6 z-10">
              <button
                className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </Link>
          </DialogClose>

          {previousImageId && previousImageParams && (
            <Link
              href={`/image/${previousImageId}?r=${previousImageParams.r}&c=${previousImageParams.c}&p=${previousImageParams.p}`}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10"
            >
              <button
                className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                ←
              </button>
            </Link>
          )}

          {nextImageId && nextImageParams && (
            <Link
              href={`/image/${nextImageId}?r=${nextImageParams.r}&c=${nextImageParams.c}&p=${nextImageParams.p}`}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
            >
              <button
                className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                →
              </button>
            </Link>
          )}

          <div
            className="relative max-w-7xl mx-auto w-full h-full flex flex-col items-center justify-center p-6 pb-24"
            style={{ viewTransitionName: `container-${image.id}-pos-${position.r}-${position.c}` }}
          >
            <div className="relative w-full aspect-[4/3] max-h-[80vh]">
              <Image
                src={image.url}
                alt={image.title}
                width={800}
                height={600}
                className="rounded-lg object-contain"
                style={{ viewTransitionName: `image-${image.id}-pos-${position.r}-${position.c}` }}
              />
            </div>

            <DialogHeader className="w-full mt-4">
              <DialogTitle
                className="text-2xl text-white text-center"
                style={{ viewTransitionName: `title-${image.id}-pos-${position.r}-${position.c}` }}
              >
                {image.title}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
