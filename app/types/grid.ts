// types/grid.ts
import { RefObject } from 'react';
import { Draggable } from 'gsap/Draggable';

export interface GridRefs {
  containerRef: RefObject<HTMLDivElement>;
  gridRef: RefObject<HTMLDivElement>;
  rowRefs: RefObject<(HTMLDivElement | null)[]>;
  imageRefs: RefObject<(HTMLDivElement | null)[][]>;
  lastCenteredElemRef: RefObject<HTMLElement | null>;
  dragInstanceRef: RefObject<Draggable | null>;
  scrollAnimationRef: RefObject<gsap.core.Tween | null>;
}

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

export interface ImageType {
  id: string;
  url: string;
  title: string;
}

export interface GridProps {
  images: ImageType[];
  rowCount?: number;
  imagesPerRow?: number;
}