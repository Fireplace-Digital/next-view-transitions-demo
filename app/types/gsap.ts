export interface DraggableInstance {
  getVelocity(axis?: 'x' | 'y'): number;
  isThrowingOrThrowing?: boolean;
  target: HTMLElement;
  x: number;
  y: number;
  endX: number;
  endY: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
}