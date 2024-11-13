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

      console.log("Initializing Draggable with element:", gridElement);

      // Kill existing draggable if it exists
      if (draggableRef.current) {
        console.log("Killing existing Draggable instance");
        draggableRef.current.kill();
      }

      // Create new draggable instance
      const instance = Draggable.create(gridElement, {
        type: "x,y",
        trigger: containerRef.current,
        inertia: true,
        dragResistance: 0.2,
        throwResistance: 0.4,
        edgeResistance: 0.65,
        maxDuration: 2,
        minDuration: 0.5,
        overshootTolerance: 0.8,

        onDragStart: function () {
          console.log("Drag started", {
            startX: this.startX,
            startY: this.startY,
            pointerX: this.pointerX,
            pointerY: this.pointerY,
          });
          gsap.killTweensOf(gridElement);
        },

        onDrag: function () {
          console.log("Dragging", {
            x: this.x,
            y: this.y,
            deltaX: this.deltaX,
            deltaY: this.deltaY,
            pointerSpeed: this.pointerSpeed,
          });
          updateCenterImage();
        },

        onDragEnd: function () {
          console.log("Drag ended", {
            endX: this.endX,
            endY: this.endY,
            deltaX: this.deltaX,
            deltaY: this.deltaY,
            pointerSpeed: this.pointerSpeed,
            velocity: {
              x: this.tween?.vars?.velocity?.[0] || "no velocity x",
              y: this.tween?.vars?.velocity?.[1] || "no velocity y",
            },
          });
        },

        onThrowUpdate: function () {
          console.log("Throw updating", {
            x: this.x,
            y: this.y,
            progress: this.tween?.progress() || 0,
            timeScale: this.tween?.timeScale() || 0,
          });
          updateCenterImage();
        },

        onThrowComplete: function () {
          console.log("Throw completed");
          const currentX = gsap.getProperty(gridElement, "x") as number;
          const currentY = gsap.getProperty(gridElement, "y") as number;

          const centerElem = document.elementFromPoint(
            dimensions.winMidX,
            dimensions.winMidY
          );

          if (centerElem?.classList.contains("grid-image")) {
            console.log("Snapping to center image");
            const bcr = centerElem.getBoundingClientRect();
            gsap.to(gridElement, {
              x: currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2)),
              y: currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2)),
              duration: 0.3,
              ease: "power2.out",
              onUpdate: updateCenterImage,
            });
          }
        },
      })[0];

      draggableRef.current = instance;
      console.log("Draggable instance created:", instance);

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
              dimensions.winMidY
            );

            if (centerElem?.classList.contains("grid-image")) {
              const bcr = centerElem.getBoundingClientRect();
              const finalX =
                currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
              const finalY =
                currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

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

      containerRef.current?.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        console.log("Cleaning up Draggable");
        containerRef.current?.removeEventListener("wheel", handleWheel);
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
      dependencies: [dimensions, updateCenterImage, scrollAnimation],
    }
  );

  return draggableRef.current;
}
