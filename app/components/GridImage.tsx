import React from 'react';
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { ImageType, Dimensions } from '../types/grid';

interface GridImageProps {
  rowIndex: number;
  colIndex: number;
  image: ImageType;
  dimensions: Dimensions;
  imageRef: (el: HTMLDivElement | null) => void;
  isPriority: boolean;
}

export const GridImage: React.FC<GridImageProps> = ({
  colIndex,
  image,
  dimensions,
  imageRef,
  isPriority
}) => {
  const { boxWidth, boxHeight, horizSpacing } = dimensions;
  const imageX = colIndex * horizSpacing;

  return (
    <div
      ref={imageRef}
      className="grid-image absolute"
      style={{
        transform: `translateX(${imageX}px)`,
        width: boxWidth,
        height: boxHeight
      }}
    >
      <Link
        href={`/image/${image.id}`}
        className="block w-full h-full relative"
      >
        <Image
          src={image.url}
          alt={image.title}
          fill
          className="rounded-lg transition-opacity hover:opacity-90 object-cover"
          style={{ viewTransitionName: `image-${image.id}` }}
          priority={isPriority}
        />
      </Link>
    </div>
  );
};