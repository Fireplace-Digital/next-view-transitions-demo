// components/GridItem.tsx
'use client'; // Add this at the top of the file
import { useRef, useEffect } from 'react';
import Image from 'next/image';  // Using Next.js Image component for optimization
import { useGrid } from '@/app/context/GridContext';
import gsap from 'gsap';
import { GridItem as GridItemType } from '@/app/types/grid';

interface GridItemProps {
  item: GridItemType;
}

const GridItem = ({ item }: GridItemProps) => {
  const { focusedItem, setFocusedItem, isDragging, grid } = useGrid();
  const itemRef = useRef<HTMLDivElement>(null);

  const isFocused = focusedItem === item.id;
  const size = item.size || 'small';  // Default to small if not specified

  useEffect(() => {
    if (!itemRef.current) return;

    const animation = gsap.to(itemRef.current, {
      scale: isFocused ? 1 : 0.8,
      duration: 0.5,
      ease: 'expo.inOut',
      paused: true,
    });

    if (isFocused) {
      animation.play();
    } else {
      animation.reverse();
    }

    return () => {
      animation.kill();
    };
  }, [isFocused]);

  const handleClick = () => {
    if (isDragging) return;
    setFocusedItem(isFocused ? null : item.id);
  };

  return (
    <div
      ref={itemRef}
      className={`absolute cursor-pointer overflow-hidden ${
        size === 'large' ? 'w-[420px] h-[420px]' : 'w-[200px] h-[200px]'
      }`}
      style={{
        left: `${item.position?.x || 0}px`,
        top: `${item.position?.y || 0}px`,
        zIndex: isFocused ? 10 : 1,
      }}
      onClick={handleClick}
    >
      <Image
        src={item.url}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-300"
        sizes={size === 'large' ? '420px' : '200px'}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
        <h3 className="text-white text-lg">{item.title}</h3>
      </div>
    </div>
  );
};

export default GridItem;