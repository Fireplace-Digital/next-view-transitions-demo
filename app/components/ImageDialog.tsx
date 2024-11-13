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

interface ImageDialogProps {
  image: ImageType;
}

export default function ImageDialog({ image }: ImageDialogProps) {
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

          <div
            className="relative max-w-7xl mx-auto w-full h-full flex flex-col items-center justify-center p-6"
            style={{ viewTransitionName: `container-${image.id}` }}
          >
            <div className="relative w-full aspect-[4/3] max-h-[80vh]">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="rounded-lg object-contain"
                style={{ viewTransitionName: `image-${image.id}` }}
                priority
              />
            </div>

            <DialogHeader className="w-full mt-4">
              <DialogTitle
                className="text-2xl text-white text-center"
                style={{ viewTransitionName: `title-${image.id}` }}
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
