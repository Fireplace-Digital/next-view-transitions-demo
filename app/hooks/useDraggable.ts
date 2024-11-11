import { useEffect } from 'react';
import type { Dimensions } from '../types/grid';

export function useDraggable(
  gridRef: React.RefObject<HTMLDivElement>,
  dimensions: Dimensions,
  updateCenterImage: () => void,
  isGsapReady: boolean
) {
  useEffect(() => {
    if (!isGsapReady || !gridRef.current || typeof window === 'undefined') return;

    try {
      const draggable = window.Draggable.create(gridRef.current, {
        type: 'x,y',
        inertia: true,
        onDrag: updateCenterImage,
        onThrowUpdate: updateCenterImage,
        dragResistance: 0.4,
        resistance: 400,
        bounds: window,
        cursor: 'grab',
        onDragStart: function() {
          console.log('Drag started');
        },
        onDragEnd: function() {
          console.log('Drag ended');
        },
        snap: {
          x: function(endValue: number) {
            const centerElem = document.elementFromPoint(dimensions.winMidX, dimensions.winMidY);
            if (!centerElem) return endValue;
            const bcr = centerElem.getBoundingClientRect();
            const midX = bcr.x + bcr.width / 2;
            return endValue + (dimensions.winMidX - midX);
          },
          y: function(endValue: number) {
            const centerElem = document.elementFromPoint(dimensions.winMidX, dimensions.winMidY);
            if (!centerElem) return endValue;
            const bcr = centerElem.getBoundingClientRect();
            const midY = bcr.y + bcr.height / 2;
            return endValue + (dimensions.winMidY - midY);
          }
        }
      });

      console.log('Draggable instance created:', draggable);
    } catch (error) {
      console.error('Error creating Draggable:', error);
    }

    return () => {
      try {
        if (window.Draggable && gridRef.current) {
          const instance = window.Draggable.get(gridRef.current);
          if (instance) {
            instance.kill();
          }
        }
      } catch (error) {
        console.error('Error cleaning up Draggable:', error);
      }
    };
  }, [dimensions, updateCenterImage, gridRef, isGsapReady]);
}