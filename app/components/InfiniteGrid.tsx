// components/InfiniteGrid.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGrid } from '@/app/context/GridContext';
import GridItem from './GridItem';
import { GridItem as GridItemType } from '@/app/types/grid';

interface InfiniteGridProps {
  items: GridItemType[];
}

const InfiniteGrid = ({ items }: InfiniteGridProps) => {
  const { isDragging, position, setIsDragging, updatePosition } = useGrid();
  const gridRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      mouseRef.current = { x: e.clientX, y: e.clientY };
      const deltaX = mouseRef.current.x - prevMouseRef.current.x;
      const deltaY = mouseRef.current.y - prevMouseRef.current.y;

      updatePosition(position.x + deltaX, position.y + deltaY);
      prevMouseRef.current = mouseRef.current;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, updatePosition, setIsDragging]);

  return (
    <div 
      ref={gridRef}
      className="fixed inset-0 overflow-hidden"
      onMouseDown={(e) => {
        setIsDragging(true);
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      }}
    >
      <div
        className="absolute"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          left: '50%',
          top: '50%',
          willChange: 'transform',
        }}
      >
        <div className="relative">
          {items.map((item) => (
            <GridItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteGrid;