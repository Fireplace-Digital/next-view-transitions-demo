// context/GridContext.tsx
'use client'; // Add this at the top of the file
import { createContext, useContext, useRef, useState } from 'react';
import gsap from 'gsap';

// You can either import these from types/grid.ts or define them here
interface GridConfig {
  spacing: number;
  smallSize: number;
  largeSize: number;
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface GridContextType {
  isDragging: boolean;
  isFocused: boolean;
  focusedItem: string | null;
  position: Position;
  grid: GridConfig;  // Added this to the context type
  setIsDragging: (value: boolean) => void;
  setFocusedItem: (id: string | null) => void;
  updatePosition: (x: number, y: number) => void;
}

const defaultGrid: GridConfig = {
  spacing: 20,
  smallSize: 200,
  largeSize: 420,
  width: 1600,
  height: 1000,
};

const defaultPosition: Position = {
  x: 0,
  y: 0,
};

const GridContext = createContext<GridContextType | undefined>(undefined);

export function GridProvider({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [grid] = useState<GridConfig>(defaultGrid);

  const updatePosition = (x: number, y: number) => {
    // Implement wrapping logic
    const wrappedX = gsap.utils.wrap(-grid.width/2, grid.width/2, x);
    const wrappedY = gsap.utils.wrap(-grid.height/2, grid.height/2, y);
    setPosition({ x: wrappedX, y: wrappedY });
  };

  return (
    <GridContext.Provider
      value={{
        isDragging,
        isFocused,
        focusedItem,
        position,
        grid,  // Now properly typed
        setIsDragging,
        setFocusedItem,
        updatePosition,
      }}
    >
      {children}
    </GridContext.Provider>
  );
}

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) throw new Error('useGrid must be used within GridProvider');
  return context;
};