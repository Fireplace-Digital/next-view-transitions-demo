import { gsap } from 'gsap';
import { GRID_CONSTANTS } from '../constants/GridConstants';
import type { Dimensions } from '../types/grid';
import type { Draggable } from 'gsap/Draggable';

export function createDragHandler(
  gridRef: HTMLDivElement,
  dimensions: Dimensions,
  updateCenterImage: () => void,
  snapToNearestImage: (x: number, y: number) => void
) {
  return function onDragEnd(this: Draggable) {
    // Access velocity through the instance vars
    const currentX = gsap.getProperty(gridRef, "x") as number;
    const currentY = gsap.getProperty(gridRef, "y") as number;
    
    // Let GSAP handle the inertia
    gsap.to(gridRef, {
      x: currentX,
      y: currentY,
      duration: GRID_CONSTANTS.INERTIA_DURATION,
      ease: "power2.out",
      onUpdate: updateCenterImage,
      onComplete: () => snapToNearestImage(currentX, currentY)
    });
  };
}

export function createWheelHandler(
  gridRef: HTMLDivElement,
  scrollAnimation: gsap.core.Tween | null,
  dimensions: Dimensions,
  updateCenterImage: () => void,
  snapToNearestImage: (x: number, y: number) => void,
  setScrollAnimation: (animation: gsap.core.Tween) => void
) {
  return function handleWheel(e: WheelEvent) {
    e.preventDefault();

    if (scrollAnimation) {
      scrollAnimation.kill();
    }

    const currentX = gsap.getProperty(gridRef, "x") as number;
    const currentY = gsap.getProperty(gridRef, "y") as number;

    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const deltaX = isHorizontal ? e.deltaX : 0;
    const deltaY = !isHorizontal ? e.deltaY : 0;

    const newAnimation = gsap.to(gridRef, {
      x: currentX - deltaX * GRID_CONSTANTS.SCROLL_SPEED,
      y: currentY - deltaY * GRID_CONSTANTS.SCROLL_SPEED,
      duration: GRID_CONSTANTS.SCROLL_SMOOTHING,
      ease: "power2.out",
      onUpdate: updateCenterImage,
      onComplete: () => {
        const centerElem = document.elementFromPoint(
          dimensions.winMidX,
          dimensions.winMidY
        );

        if (centerElem?.classList.contains("grid-image")) {
          const bcr = centerElem.getBoundingClientRect();
          const finalX = currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
          const finalY = currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

          gsap.to(gridRef, {
            x: finalX,
            y: finalY,
            duration: GRID_CONSTANTS.SNAP_DURATION,
            ease: "power2.out",
            onUpdate: updateCenterImage
          });
        }
      }
    });

    setScrollAnimation(newAnimation);
  };
}