// utils/GridUtils.ts
import { gsap } from 'gsap';
import { GRID_CONSTANTS } from '../constants/GridConstants';
import type { Dimensions } from '../types/grid';

export function snapToNearestImage(
  gridRef: React.RefObject<HTMLDivElement>,
  dimensions: Dimensions,
  x: number,
  y: number,
  updateCenterImage: () => void
) {
  if (!gridRef.current) return;

  const centerElem = document.elementFromPoint(
    dimensions.winMidX,
    dimensions.winMidY
  );

  if (centerElem?.classList.contains("grid-image")) {
    const bcr = centerElem.getBoundingClientRect();
    const targetX = x + (dimensions.winMidX - (bcr.x + bcr.width / 2));
    const targetY = y + (dimensions.winMidY - (bcr.y + bcr.height / 2));

    gsap.to(gridRef.current, {
      x: targetX,
      y: targetY,
      duration: GRID_CONSTANTS.SNAP_DURATION,
      ease: "power2.out",
      onUpdate: updateCenterImage
    });
  }
}