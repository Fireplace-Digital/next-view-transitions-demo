import { useState, useEffect } from 'react';
import { calculateDimensions } from '../utils/arrayUtils';
import type { Dimensions } from '../types/grid';

export function useGridDimensions(imgMidIndex: number, rowMidIndex: number) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    winMidX: 0,
    winMidY: 0,
    boxWidth: 0,
    boxHeight: 0,
    gutter: 0,
    horizSpacing: 0,
    vertSpacing: 0,
    horizOffset: 0,
    vertOffset: 0
  });

  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = calculateDimensions(
        window.innerWidth,
        window.innerHeight,
        imgMidIndex,
        rowMidIndex
      );
      setDimensions(newDimensions);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [imgMidIndex, rowMidIndex]);

  return dimensions;
}