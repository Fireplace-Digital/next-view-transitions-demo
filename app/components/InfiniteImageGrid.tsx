"use client";

import React, { useRef, useCallback, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGridDimensions } from "../hooks/useGridDimensions";
import { moveArrayIndex } from "../utils/arrayUtils";
import type { GridProps, ImageType } from "../types/grid";

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

    const imgMidIndex = Math.floor(imagesPerRow / 2);
    const rowMidIndex = Math.floor(rowCount / 2);

    const dimensions = useGridDimensions(imgMidIndex, rowMidIndex);

    useLayoutEffect(() => {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, useGSAP);
    }, [])

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

                    const rowY = Number(gsap.getProperty(rowRefs.current[0], "y"));

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

                    const rowY = Number(gsap.getProperty(
                        rowRefs.current[rowRefs.current.length - 1],
                        "y",
                    ));

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

                        const imgX = Number(gsap.getProperty(firstImage, "x"));
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

                        const imgX = Number(gsap.getProperty(lastImage, "x"));
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
        const centerImage = elements.find((elem): elem is HTMLElement =>
            elem instanceof HTMLElement && elem.classList.contains("grid-image")
        );

        if (
            centerImage &&
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
                            ((rowIndex * imagesPerRow + colIndex) % images.length + images.length) % images.length;
                        const image: ImageType = images[imageIndex];
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
                                    href={`/image/${image.id}?instance=${rowIndex}-${colIndex}`}
                                    className="block w-full h-full relative"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="rounded-lg transition-opacity hover:opacity-90 object-cover"
                                        style={{
                                            viewTransitionName: `image-${image.id}-${rowIndex}-${colIndex}`
                                        }}
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

    useGSAP(
        () => {
            if (!containerRef.current || !gridRef.current) return;

            // Constants for scroll behavior
            const SCROLL_SPEED = 1.2;
            const SCROLL_SMOOTHING = 0.3;
            const SCROLL_RESISTANCE = 0.4;
            const SNAP_DURATION = 0.5;
            const SNAP_EASE = "power2.out";

            // Helper function for snapping to nearest image
            const snapToNearestImage = (duration = SNAP_DURATION) => {
                if (!gridRef.current) return;

                const elements = document.elementsFromPoint(
                    dimensions.winMidX,
                    dimensions.winMidY
                );
                const centerImage = elements.find((elem): elem is HTMLElement =>
                    elem instanceof HTMLElement && elem.classList.contains("grid-image")
                );

                if (centerImage) {
                    const bcr = centerImage.getBoundingClientRect();
                    const currentX = Number(gsap.getProperty(gridRef.current, "x"));
                    const currentY = Number(gsap.getProperty(gridRef.current, "y"));
                    const targetX = currentX + (dimensions.winMidX - (bcr.x + bcr.width / 2));
                    const targetY = currentY + (dimensions.winMidY - (bcr.y + bcr.height / 2));

                    // gsap.to(gridRef.current, {
                    //     x: targetX,
                    //     y: targetY,
                    //     duration: duration,
                    //     ease: SNAP_EASE,
                    //     onUpdate: updateCenterImage
                    // });
                    const distanceX = Math.abs(targetX - currentX);
                    const distanceY = Math.abs(targetY - currentY);

                    if (distanceX > 10 || distanceY > 10) {
                        gsap.to(gridRef.current, {
                            x: targetX,
                            y: targetY,
                            duration: duration,
                            ease: SNAP_EASE,
                            onUpdate: () => {
                                const progress = Number(gsap.getProperty(gridRef.current, "progress"));
                                if (progress > 0.8) {
                                    updateCenterImage();
                                }
                            },
                        });
                    }
                }
            };

            // Create ScrollTrigger for smooth scrolling
            const st = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (!gridRef.current || dragInstanceRef.current?.isDragging) return;

                    const deltaX = self.getVelocity() * SCROLL_SPEED;
                    const deltaY = self.getVelocity() * SCROLL_SPEED;

                    const currentX = Number(gsap.getProperty(gridRef.current, "x"));
                    const currentY = Number(gsap.getProperty(gridRef.current, "y"));

                    gsap.to(gridRef.current, {
                        x: currentX - deltaX,
                        y: currentY - deltaY,
                        duration: SCROLL_SMOOTHING,
                        ease: "power2.out",
                        overwrite: true,
                        onUpdate: updateCenterImage
                    });
                }
            });

            // Initialize Draggable with inertia
            dragInstanceRef.current = Draggable.create(gridRef.current, {
                type: "x,y",
                inertia: true,
                dragResistance: 0.4,
                edgeResistance: 0.4,
                throwResistance: 0.4,
                maxDuration: 1.2,
                onDragStart: () => {
                    st.disable(); // Disable ScrollTrigger during drag
                },
                onDrag: () => {
                    const dx = dragInstanceRef.current?.deltaX || 0;
                    const dy = dragInstanceRef.current?.deltaY || 0;
                    const dragSpeed = Math.sqrt(dx * dx + dy * dy);

                    if (dragSpeed < 10) {
                        updateCenterImage();
                    }
                },
                onThrowUpdate: updateCenterImage,
                onDragEnd: function() {
                    st.enable(); // Re-enable ScrollTrigger
                    updateCenterImage();
                }
            })[0];

            // Handle wheel events for precise control
            const handleWheel = (e: WheelEvent) => {
                if (dragInstanceRef.current?.isDragging) return;
                e.preventDefault();

                const speed = SCROLL_SPEED * (e.deltaMode === 1 ? 20 : 1);
                const currentX = Number(gsap.getProperty(gridRef.current, "x"));
                const currentY = Number(gsap.getProperty(gridRef.current, "y"));

                gsap.to(gridRef.current, {
                    x: currentX - e.deltaX * speed,
                    y: currentY - e.deltaY * speed,
                    duration: SCROLL_SMOOTHING,
                    ease: "power2.out",
                    overwrite: true,
                    onUpdate: updateCenterImage
                });
            };

            containerRef.current.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                st.kill();
                containerRef.current?.removeEventListener('wheel', handleWheel);
                if (dragInstanceRef.current) {
                    dragInstanceRef.current.kill();
                }
            };
        },
        { scope: containerRef, dependencies: [dimensions, updateCenterImage] }
    );

    return (
        <div
            ref={containerRef}
            className="overflow-hidden w-screen h-screen fixed inset-0"
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
