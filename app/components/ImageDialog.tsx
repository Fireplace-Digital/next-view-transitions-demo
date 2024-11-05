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
        className="max-w-3xl"
        onEscapeKeyDown={() => router.push("/")}
        onInteractOutside={() => router.push("/")}
      >
        <div className="relative">
          <DialogClose asChild>
            <Link href="/" className="absolute right-4 top-4 z-10">
              <button
                className="rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </Link>
          </DialogClose>
          <Image
            src={image.url}
            alt={image.title}
            width={800}
            height={600}
            className="rounded-lg"
            style={{ viewTransitionName: `image-${image.id}` }}
            priority
          />
          <DialogHeader>
            <DialogTitle className="mt-4 text-xl">{image.title}</DialogTitle>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}
