// types/grid.ts
export interface GridItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  size?: 'small' | 'large';
  position?: {
    x: number;
    y: number;
  };
}

export interface GridConfig {
  spacing: number;
  smallSize: number;
  largeSize: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}