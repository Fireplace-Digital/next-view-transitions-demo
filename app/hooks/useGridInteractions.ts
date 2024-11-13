import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import type { RefObject } from "react";
import { useRef } from "react";
import { GRID_CONSTANTS } from "../constants/GridConstants";
import type { Dimensions } from "../types/grid";

export function useGridInteractions(
  containerRef: RefObject<HTMLDivElement>,
  gridRef: RefObject<HTMLDivElement>,
  scrollAnimation: gsap.core.Tween | null,
  setScrollAnimation: (animation: gsap.core.Tween | null) => void,
  dimensions: Dimensions,
  updateCenterImage: () => void
) {
  const draggableRef = useRef<Draggable | null>(null);

  useGSAP(
    () => {
      const gridElement = gridRef.current;
      if (!gridElement) return;

      // Kill existing draggable if it exists
      if (draggableRef.current) {
        draggableRef.current.kill();
      }

      // Create new draggable instance
      const instance = Draggable.create(gridElement, {
        type: "x,y",
        inertia: true,
        dragResistance: 0.2,
        edgeResistance: 0.65,
        throwResistance: 0.25,
        minDuration: 0.5,
        maxDuration: 2,
        onDrag: updateCenterImage,
        onThrowUpdate: function() {
          updateCenterImage();
          console.log("Throw velocity:", this.getVelocity());
        },
        onDragEnd: function() {
          const vx = this.getVelocity("x");
          const vy = this.getVelocity("y");
          const currentX = gsap.getProperty(gridElement, "x") as number;
          const currentY = gsap.getProperty(gridElement, "y") as number;
          
          if (Math.abs(vx) > 20 || Math.abs(vy) > 20) {
            const momentum = Math.sqrt(vx * vx + vy * vy);
            const duration = Math.min(2, momentum / 2000);
            
            gsap.to(gridElement, {
              x: currentX + (vx * 0.5),
              y: currentY + (vy * 0.5),
              duration: duration,
              ease: "power2.out",
              onUpdate: updateCenterImage,
              onComplete: () => {
                const finalX = gsap.getProperty(gridElement, "x") as number;
                const finalY = gsap.getProperty(gridElement, "y") as number;
                
                const centerElem = document.elementFromPoint(
                  dimensions.winMidX,
                  dimensions.winMidY
                );
                
                if (centerElem?.classList.contains("grid-image")) {
                  const bcr = centerElem.getBoundingClientRect();
                  gsap.to(gridElement, {
                    x: finalX + (dimensions.winMidX - (bcr.x + bcr.width / 2)),
                    y: finalY + (dimensions.winMidY - (bcr.y + bcr.height / 2)),
                    duration: 0.3,
                    ease: "power2.out",
                    onUpdate: updateCenterImage
                  });
                }
              }
            });
          } else {
            const centerElem = document.elementFromPoint(
              dimensions.winMidX,
              dimensions.winMidY
            );
            
            if (centerElem?.classList.contains("grid-image")) {
              const bcr = centerElem.getBoundingClientRect();
              gsap.to(gridElement, {
                x: currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2)),
                y: currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2)),
                duration: 0.3,
                ease: "power2.out",
                onUpdate: updateCenterImage
              });
            }
          }
        }
      })[0];

      draggableRef.current = instance;

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        if (scrollAnimation) {
          scrollAnimation.kill();
        }

        const currentX = gsap.getProperty(gridElement, "x") as number;
        const currentY = gsap.getProperty(gridElement, "y") as number;

        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const deltaX = isHorizontal ? e.deltaX : 0;
        const deltaY = !isHorizontal ? e.deltaY : 0;

        const newAnimation = gsap.to(gridElement, {
          x: currentX - deltaX * GRID_CONSTANTS.SCROLL_SPEED,
          y: currentY - deltaY * GRID_CONSTANTS.SCROLL_SPEED,
          duration: GRID_CONSTANTS.SCROLL_SMOOTHING,
          ease: "power2.out",
          onUpdate: updateCenterImage,
          onComplete: () => {
            const centerElem = document.elementFromPoint(
              dimensions.winMidX,
              dimensions.winMidY,
            );

            if (centerElem?.classList.contains("grid-image")) {
              const bcr = centerElem.getBoundingClientRect();
              const finalX = currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
              const finalY = currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

              gsap.to(gridElement, {
                x: finalX,
                y: finalY,
                duration: GRID_CONSTANTS.SNAP_DURATION,
                ease: "power2.out",
                onUpdate: updateCenterImage,
              });
            }
          },
        });

        setScrollAnimation(newAnimation);
      };

      gridElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        gridElement.removeEventListener("wheel", handleWheel);
        if (draggableRef.current) {
          draggableRef.current.kill();
          draggableRef.current = null;
        }
        if (scrollAnimation) {
          scrollAnimation.kill();
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [dimensions, updateCenterImage, scrollAnimation]
    }
  );

  return draggableRef.current;
}