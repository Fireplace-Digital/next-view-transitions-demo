import React, { useContext } from 'react';
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ProjectContext } from '@/lib/project-context';
import type { ImageType, Dimensions } from '../types/grid';

interface GridImageProps {
  rowIndex: number;
  colIndex: number;
  image: ImageType;
  dimensions: Dimensions;
  imageRef: (el: HTMLDivElement | null) => void;
  isPriority: boolean;
}

const GridImage: React.FC<GridImageProps> = ({
  colIndex,
  image,
  dimensions,
  imageRef,
  isPriority,
  rowIndex
}) => {
  const { boxWidth, boxHeight, horizSpacing, vertSpacing } = dimensions;
  const imageX = colIndex * horizSpacing;
  const { setHoveredProject } = useContext(ProjectContext);

  const handleMouseEnter = () => {
    setHoveredProject(image.title);
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
  };

  return (
    <div
      ref={imageRef}
      className="grid-image absolute"
      style={{
        transform: `translateX(${imageX}px)`,
        width: boxWidth,
        height: boxHeight,
        top: (vertSpacing - boxHeight) / 2
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/image/${image.id}?r=${rowIndex}&c=${colIndex}&p=${rowIndex * 9 + colIndex}`}
        className="block w-full h-full relative"
      >
        <h2 className="sr-only">{image.title}</h2>
        <Image
          src={image.url}
          alt={image.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg transition-opacity hover:opacity-90 object-cover"
          style={{ viewTransitionName: `image-${image.id}-pos-${rowIndex}-${colIndex}` }}
          priority={isPriority}
        />
      </Link>
    </div>
  );
};

export default GridImage;