import type { ImageType } from '../components/ImageGallery';

export type { ImageType };

export interface Dimensions {
  winMidX: number;
  winMidY: number;
  boxWidth: number;
  boxHeight: number;
  gutter: number;
  horizSpacing: number;
  vertSpacing: number;
  horizOffset: number;
  vertOffset: number;
}

export interface GridProps {
  images: ImageType[];
  rowCount?: number;
  imagesPerRow?: number;
}