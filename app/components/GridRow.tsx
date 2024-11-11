import React from 'react';
import { GridImage } from './GridImage';
import type { ImageType, Dimensions, GridProps } from '../types/grid';

interface GridRowProps {
  rowIndex: number;
  imagesPerRow: number;
  images: ImageType[];
  dimensions: Dimensions;
  rowRef: (el: HTMLDivElement | null) => void;
  imageRefs: (el: HTMLDivElement | null, colIndex: number) => void;
  imgMidIndex: number;
  rowMidIndex: number;
}

export const GridRow: React.FC<GridRowProps> = ({
  rowIndex,
  imagesPerRow,
  images,
  dimensions,
  rowRef,
  imageRefs,
  imgMidIndex,
  rowMidIndex
}) => {
  const { boxWidth, boxHeight, horizSpacing, vertSpacing, horizOffset, vertOffset } = dimensions;
  const isOffset = rowIndex % 2 !== 0;
  const rowX = isOffset ? horizOffset - boxWidth / 2 : horizOffset;
  const rowY = rowIndex * vertSpacing + vertOffset;

  return (
    <div
      ref={rowRef}
      className="grid-row absolute"
      style={{ 
        transform: `translate(${rowX}px, ${rowY}px)`,
        height: boxHeight,
        width: '100%'
      }}
      data-offset={isOffset.toString()}
    >
      {Array(imagesPerRow).fill(null).map((_, colIndex) => (
        <GridImage
          key={colIndex}
          rowIndex={rowIndex}
          colIndex={colIndex}
          image={images[(rowIndex * imagesPerRow + colIndex) % images.length]}
          dimensions={dimensions}
          imageRef={(el) => imageRefs(el, colIndex)}
          isPriority={rowIndex === rowMidIndex && colIndex === imgMidIndex}
        />
      ))}
    </div>
  );
};