"use client";

import React, { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useGridDimensions } from "../hooks/useGridDimensions";
import { useGridInteractions } from "../hooks/useGridInteractions";
import { moveArrayIndex } from "../utils/arrayUtils";
import type { GridProps } from "../types/grid";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

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
  const [scrollAnimation, setScrollAnimation] = useState<gsap.core.Tween | null>(null);

  const imgMidIndex = Math.floor(imagesPerRow / 2);
  const rowMidIndex = Math.floor(rowCount / 2);

  const dimensions = useGridDimensions(imgMidIndex, rowMidIndex);

  const checkPositions = useCallback(
    (elem: HTMLElement) => {
      let rowIndex = -1;
      let imgIndex = -1;

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const images = imageRefs.current[i] || [];
        images.forEach((img, j) => {
          if (img && elem.isSameNode(img)) {
            rowIndex = i;
            imgIndex = j;
          }
        });
      });

      if (rowIndex === -1) return;

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
            width: horizSpacing * (imagesPerRow * 2),
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

  // Use the grid interactions hook
  const draggable = useGridInteractions(
    containerRef,
    gridRef,
    scrollAnimation,
    setScrollAnimation,
    dimensions,
    updateCenterImage
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