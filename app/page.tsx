'use client';

import ClientLayout from '@/app/components/ClientLayout';
import InfiniteGrid from '@/app/components/InfiniteGrid';
import { GridItem } from '@/app/types/grid';
import Canvas from '@/app/components/Canvas';

const baseItems = [
  { id: "1", url: "https://picsum.photos/id/1/800/600", title: "Image 1" },
  { id: "2", url: "https://picsum.photos/id/2/800/600", title: "Image 2" },
  { id: "3", url: "https://picsum.photos/id/3/800/600", title: "Image 3" },
  { id: "4", url: "https://picsum.photos/id/4/800/600", title: "Image 4" },
  { id: "5", url: "https://picsum.photos/id/5/800/600", title: "Image 5" },
];

// Calculate positions for the grid items
const items: GridItem[] = baseItems.map((item, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const size = index % 3 === 1 ? 'large' : 'small';
  
  return {
    ...item,
    size,
    position: {
      x: col * (size === 'large' ? 420 : 200) + (col * 20),
      y: row * 200 + (row * 20),
    },
  };
});

export default function Home() {
  return (
    <ClientLayout>
      <div className="fixed inset-0 bg-red-500 opacity-10 z-10" /> {/* Debug layer */}
  <InfiniteGrid items={items} />
    </ClientLayout>
  );
}