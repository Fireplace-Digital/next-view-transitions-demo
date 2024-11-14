"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Draggable } from "gsap/Draggable";
import { useGridDimensions } from "../hooks/useGridDimensions";
import { moveArrayIndex } from "../utils/arrayUtils";
import type { GridProps } from "../types/grid";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, InertiaPlugin);

const debounce = (fn: Function, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const InfiniteImageGrid: React.FC<GridProps> = ({
  images,
  rowCount = 5,
  imagesPerRow = 9,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const lastCenteredElemRef = useRef<HTMLElement | null>(null);
  const dragInstanceRef = useRef<Draggable | null>(null);
  const scrollAnimationRef = useRef<gsap.core.Tween | null>(null);

  const imgMidIndex = Math.floor(imagesPerRow / 2);
  const rowMidIndex = Math.floor(rowCount / 2);

  const dimensions = useGridDimensions(imgMidIndex, rowMidIndex);

  // Add cleanup and optimization
  const cleanup = useCallback(() => {
    // Clear animation refs
    if (scrollAnimationRef.current) {
      scrollAnimationRef.current.kill();
      scrollAnimationRef.current = null;
    }
    if (dragInstanceRef.current) {
      dragInstanceRef.current.kill();
      dragInstanceRef.current = null;
    }

    // Clear row and image refs
    rowRefs.current = [];
    imageRefs.current = [];
  }, []);

  // Add resize handler with debounce
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cleanup();
        // Re-initialize grid
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      cleanup();
    };
  }, [cleanup]);

  const createPositionMap = (
    rowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
    imageRefs: React.MutableRefObject<(HTMLDivElement | null)[][]>,
  ) => {
    const map = new Map<HTMLElement, { rowIndex: number; imgIndex: number }>();

    rowRefs.current.forEach((row, rowIndex) => {
      if (!row) return;
      const images = imageRefs.current[rowIndex] || [];
      images.forEach((img, imgIndex) => {
        if (img) map.set(img, { rowIndex, imgIndex });
      });
    });

    return map;
  };

  const checkPositions = useCallback(
    (elem: HTMLElement) => {
      // Create position map for O(1) lookup
      const positionMap = createPositionMap(rowRefs, imageRefs);
      const position = positionMap.get(elem);

      if (!position) return;

      const { rowIndex, imgIndex } = position;
      const { boxWidth, boxHeight, gutter } = dimensions;

      // Handle row repositioning
      if (rowIndex < rowMidIndex) {
        for (let i = rowIndex; i < rowMidIndex; i++) {
          const lastRow = rowRefs.current[rowRefs.current.length - 1];
          if (!lastRow) continue;

          const rowY = gsap.getProperty(rowRefs.current[0], "y") as number;

          if (rowRefs.current.length % 2 === 1) {
            const isOffset = lastRow.dataset.offset === "true";
            gsap.set(lastRow, {
              y: rowY - gutter - boxHeight,
              x: isOffset ? "-=" + boxWidth / 2 : "+=" + boxWidth / 2,
            });
            lastRow.dataset.offset = (!isOffset).toString();
          } else {
            gsap.set(lastRow, { y: rowY - gutter - boxHeight });
          }

          // Update refs arrays
          moveArrayIndex(rowRefs.current, rowRefs.current.length - 1, 0);
          moveArrayIndex(imageRefs.current, imageRefs.current.length - 1, 0);
        }
      } else if (rowIndex > rowMidIndex) {
        for (let i = rowMidIndex; i < rowIndex; i++) {
          const firstRow = rowRefs.current[0];
          if (!firstRow) continue;

          const rowY = gsap.getProperty(
            rowRefs.current[rowRefs.current.length - 1],
            "y",
          ) as number;

          if (rowRefs.current.length % 2 === 1) {
            const isOffset = firstRow.dataset.offset === "true";
            gsap.set(firstRow, {
              y: rowY + gutter + boxHeight,
              x: isOffset ? "-=" + boxWidth / 2 : "+=" + boxWidth / 2,
            });
            firstRow.dataset.offset = (!isOffset).toString();
          } else {
            gsap.set(firstRow, { y: rowY + gutter + boxHeight });
          }

          moveArrayIndex(rowRefs.current, 0, rowRefs.current.length - 1);
          moveArrayIndex(imageRefs.current, 0, imageRefs.current.length - 1);
        }
      }

      // Handle image repositioning within rows
      if (imgIndex < imgMidIndex) {
        rowRefs.current.forEach((_, rowNum) => {
          const row = imageRefs.current[rowNum];
          if (!row) return;

          for (let i = imgIndex; i < imgMidIndex; i++) {
            const firstImage = row[0];
            if (!firstImage) continue;

            const imgX = gsap.getProperty(firstImage, "x") as number;
            const lastImage = row[row.length - 1];
            if (!lastImage) continue;

            gsap.set(lastImage, { x: imgX - gutter - boxWidth });
            moveArrayIndex(row, row.length - 1, 0);
          }
        });
      } else if (imgIndex > imgMidIndex) {
        rowRefs.current.forEach((_, rowNum) => {
          const row = imageRefs.current[rowNum];
          if (!row) return;

          for (let i = imgMidIndex; i < imgIndex; i++) {
            const lastImage = row[row.length - 1];
            if (!lastImage) continue;

            const imgX = gsap.getProperty(lastImage, "x") as number;
            const firstImage = row[0];
            if (!firstImage) continue;

            gsap.set(firstImage, { x: imgX + gutter + boxWidth });
            moveArrayIndex(row, 0, row.length - 1);
          }
        });
      }
    },
    [dimensions, imgMidIndex, rowMidIndex],
  );

  const updateCenterImage = useCallback(() => {
    const { winMidX, winMidY } = dimensions;
    if (typeof document === "undefined") return;

    const elements = document.elementsFromPoint(winMidX, winMidY);
    const centerImage = elements.find((elem) =>
      elem.classList.contains("grid-image"),
    );

    if (
      centerImage instanceof HTMLElement &&
      (!lastCenteredElemRef.current ||
        !lastCenteredElemRef.current.isSameNode(centerImage))
    ) {
      lastCenteredElemRef.current = centerImage;
      checkPositions(centerImage);
    }
  }, [dimensions, checkPositions]);

  const renderGrid = useCallback(() => {
    console.log("Rendering grid with dimensions:", dimensions);
    const rows = Array(rowCount).fill(null);
    const {
      boxWidth,
      boxHeight,
      horizSpacing,
      vertSpacing,
      horizOffset,
      vertOffset,
    } = dimensions;

    return rows.map((_, rowIndex) => {
      const cols = Array(imagesPerRow).fill(null);
      const isOffset = rowIndex % 2 !== 0;
      const rowX = isOffset ? horizOffset - boxWidth / 2 : horizOffset;
      const rowY = rowIndex * vertSpacing + vertOffset;

      return (
        <div
          key={`row-${rowIndex}`}
          ref={(el: HTMLDivElement | null) => {
            rowRefs.current[rowIndex] = el;
          }}
          className="grid-row absolute"
          style={{
            transform: `translate(${rowX}px, ${rowY}px)`,
            height: vertSpacing,
            // Extend width to cover all images plus some extra for infinite scrolling
            width: horizSpacing * (imagesPerRow * 2), // Double the width
            // Or calculate exact width needed:
            // width: boxWidth * imagesPerRow + horizSpacing * (imagesPerRow - 1) + horizSpacing * 2,
            minWidth: "100%",
            background: "transparent",
          }}
          data-offset={isOffset.toString()}
        >
          {cols.map((_, colIndex) => {
            const imageIndex =
              (rowIndex * imagesPerRow + colIndex) % images.length;
            const image = images[imageIndex];
            const imageX = colIndex * horizSpacing;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                ref={(el: HTMLDivElement | null) => {
                  if (!imageRefs.current[rowIndex]) {
                    imageRefs.current[rowIndex] = [];
                  }
                  imageRefs.current[rowIndex][colIndex] = el;
                }}
                className="grid-image absolute"
                style={{
                  transform: `translateX(${imageX}px)`,
                  width: boxWidth,
                  height: boxHeight,
                  // Center the image vertically in the row
                  top: (vertSpacing - boxHeight) / 2,
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg transition-opacity hover:opacity-90 object-cover"
                    style={{ viewTransitionName: `image-${image.id}` }}
                    priority={
                      rowIndex === rowMidIndex && colIndex === imgMidIndex
                    }
                  />
                </Link>
              </div>
            );
          })}
        </div>
      );
    });
  }, [dimensions, images, rowCount, imagesPerRow, imgMidIndex, rowMidIndex]);

  const debouncedCenterCheck = debounce((x: number, y: number) => {
    const centerElem = document.elementFromPoint(x, y);
    if (
      centerElem instanceof HTMLElement &&
      centerElem.classList.contains("grid-image")
    ) {
      checkPositions(centerElem);
    }
  }, 16); // 16ms = roughly one frame

  // Draggable initialization with debug logging
  // Initialize ScrollTrigger and Draggable
  useGSAP(
    () => {
      if (!gridRef.current) return;

      // Constants for inertia behavior
      const SCROLL_SPEED = 2.5; // Back to original scroll speed
      const SCROLL_MULTIPLIER = 1.2; // Additional multiplier for momentum
      const SCROLL_RESISTANCE = 0.4;
      const SNAP_DURATION = 0.3;
      const MINIMUM_VELOCITY = 0.01;
      const INERTIA_DURATION = 1.5;
      const SCROLL_SMOOTHING = 0.2;

      // Helper function for snapping to nearest image
      const snapToNearestImage = () => {
        if (!gridRef.current) return;

        const centerElem = document.elementFromPoint(
          dimensions.winMidX,
          dimensions.winMidY,
        );

        if (centerElem && centerElem.classList.contains("grid-image")) {
          const bcr = centerElem.getBoundingClientRect();
          const currentX = gsap.getProperty(gridRef.current, "x") as number;
          const currentY = gsap.getProperty(gridRef.current, "y") as number;
          const targetX =
            currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
          const targetY =
            currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

          gsap.to(gridRef.current, {
            x: targetX,
            y: targetY,
            duration: SNAP_DURATION,
            ease: "power2.out",
            onUpdate: updateCenterImage,
          });
        }
      };

      // Start tracking grid movement for inertia
      InertiaPlugin.track(gridRef.current, "x,y");

      // Initialize Draggable with inertia
      dragInstanceRef.current = Draggable.create(gridRef.current, {
        type: "x,y",
        inertia: true,
        onDrag: updateCenterImage,
        onThrowUpdate: () => {
          debouncedCenterCheck(dimensions.winMidX, dimensions.winMidY);
          updateCenterImage();
        },
        dragResistance: SCROLL_RESISTANCE,
        throwProps: true,
        edgeResistance: SCROLL_RESISTANCE,
        overshootTolerance: 0.5,
        throwResistance: SCROLL_RESISTANCE,
        snap: {
          x: function (endValue: number) {
            const centerElem = document.elementFromPoint(
              dimensions.winMidX,
              dimensions.winMidY,
            );
            if (!centerElem?.classList.contains("grid-image")) return endValue;
            const bcr = centerElem.getBoundingClientRect();
            return endValue + (dimensions.winMidX - (bcr.x + bcr.width / 2));
          },
          y: function (endValue: number) {
            const centerElem = document.elementFromPoint(
              dimensions.winMidX,
              dimensions.winMidY,
            );
            if (!centerElem?.classList.contains("grid-image")) return endValue;
            const bcr = centerElem.getBoundingClientRect();
            return endValue + (dimensions.winMidY - (bcr.y + bcr.height / 2));
          },
        },
        onThrowComplete: function () {
          updateCenterImage();
        },
        onDragEnd: function (e) {
          // Use velocityX and velocityY directly from the Draggable instance
          if (!gridRef.current) return;

          const centerElem = document.elementFromPoint(
            dimensions.winMidX,
            dimensions.winMidY,
          );

          if (centerElem && centerElem.classList.contains("grid-image")) {
            const bcr = centerElem.getBoundingClientRect();
            const currentX = gsap.getProperty(gridRef.current, "x") as number;
            const currentY = gsap.getProperty(gridRef.current, "y") as number;
            const targetX =
              currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
            const targetY =
              currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

            gsap.to(gridRef.current, {
              x: targetX,
              y: targetY,
              duration: SNAP_DURATION,
              ease: "power2.out",
              onUpdate: updateCenterImage,
              onComplete: snapToNearestImage,
            });
          }
        },
        onClick: function () {
          // Prevent click when dragging
          if (Math.abs(this.deltaX) < 3 && Math.abs(this.deltaY) < 3) {
            // Handle click
          }
        },
      })[0];

      // Enhanced wheel handler with inertia
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        if (scrollAnimationRef.current) {
          scrollAnimationRef.current.kill();
        }

        const currentX = gsap.getProperty(gridRef.current, "x") as number;
        const currentY = gsap.getProperty(gridRef.current, "y") as number;

        // Determine primary scroll direction
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const deltaX = isHorizontal ? e.deltaX : 0;
        const deltaY = !isHorizontal ? e.deltaY : 0;

        // Use inertia while maintaining the grid structure
        scrollAnimationRef.current = gsap.to(gridRef.current, {
          x: currentX - deltaX * SCROLL_SPEED,
          y: currentY - deltaY * SCROLL_SPEED,
          duration: SCROLL_SMOOTHING,
          ease: "power3.out", // Slightly modified ease for better inertia feel
          inertia: {
            x: {
              velocity: -deltaX * SCROLL_SPEED,
              end: currentX - deltaX * SCROLL_SPEED,
            },
            y: {
              velocity: -deltaY * SCROLL_SPEED,
              end: currentY - deltaY * SCROLL_SPEED,
            },
          },
          onUpdate: () => {
            debouncedCenterCheck(dimensions.winMidX, dimensions.winMidY);
            updateCenterImage();
          },
          onComplete: () => {
            // Snap to nearest image after scroll
            if (!gridRef.current) return;

            const centerElem = document.elementFromPoint(
              dimensions.winMidX,
              dimensions.winMidY,
            );

            if (centerElem && centerElem.classList.contains("grid-image")) {
              const bcr = centerElem.getBoundingClientRect();
              const finalX =
                currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
              const finalY =
                currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

              gsap.to(gridRef.current, {
                x: finalX,
                y: finalY,
                duration: 0.3,
                ease: "power2.out",
                onUpdate: updateCenterImage,
              });
            }
          },
        });
      };

      gridRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      // Cleanup function
      return () => {
        gridRef.current?.removeEventListener("wheel", handleWheel);
        if (dragInstanceRef.current) {
          dragInstanceRef.current.kill();
        }
        if (scrollAnimationRef.current) {
          scrollAnimationRef.current.kill();
        }
        InertiaPlugin.untrack(gridRef.current);
      };
    },
    {
      scope: containerRef,
      dependencies: [dimensions, updateCenterImage, debouncedCenterCheck],
    },
  );

  return (
    <div
      ref={containerRef}
      className="overflow-hidden w-screen h-screen fixed inset-0 bg-gray-100"
    >
      <div
        ref={gridRef}
        className="absolute cursor-grab active:cursor-grabbing"
        style={{
          willChange: "transform",
          userSelect: "none",
          touchAction: "none",
          top: 0,
          left: 0,
          width: `calc(100% + ${dimensions.horizSpacing * 2}px)`,
          height: `calc(100% + ${dimensions.vertSpacing * 2}px)`,
          padding: `${dimensions.vertSpacing}px ${dimensions.horizSpacing}px`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default InfiniteImageGrid;
