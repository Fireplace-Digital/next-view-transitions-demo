interface GSAPAnimation {
  progress: (value?: number) => number;
  pause: () => void;
  play: () => void;
  reverse: () => void;
  restart: () => void;
  resume: () => void;
  seek: (position: number | string) => void;
  timeScale: (value: number) => void;
}

interface DraggableOptions {
  trigger?: string | Element;
  cursor?: string;
  dragResistance?: number;
  allowContextMenu?: boolean;
  type?: 'x' | 'y' | 'rotation' | 'x,y';
  inertia?: boolean;
  autoScroll?: boolean;
  lockAxis?: boolean;
  bounds?: Element | string | { top?: number; left?: number; width?: number; height?: number };
  onDrag?: (e: Event) => void;
  onDragStart?: (e: Event) => void;
  onDragEnd?: (e: Event) => void;
  onPress?: (e: Event) => void;
  onRelease?: (e: Event) => void;
  onMove?: (e: Event) => void;
  onClick?: (e: Event) => void;
  onThrowUpdate?: (e: Event) => void;
  snap?: object | Function;
  resistance?: number;
}

interface DraggableInstance {
  kill: () => void;
  disable: () => void;
  enable: () => void;
  endDrag: (e: Event) => void;
  update: (allowRecreation?: boolean) => void;
}

interface DraggableStatic {
  create(target: Element, vars: DraggableOptions): DraggableInstance;
  get(target: Element): DraggableInstance | undefined;
}

interface GSAPStatic {
  to: (target: any, vars: object) => GSAPAnimation;
  from: (target: any, vars: object) => GSAPAnimation;
  fromTo: (target: any, fromVars: object, toVars: object) => GSAPAnimation;
  set: (target: any, vars: object) => GSAPAnimation;
  getProperty: (target: Element, property: string) => any;
  registerPlugin: (...args: any[]) => void;
  registerEase: (name: string, ease: Function) => void;
  parseEase: (ease: string | Function) => Function;
  utils: {
    snap: (increment: number) => (value: number) => number;
    random: (min: number, max: number) => number;
    interpolate: (startValue: number, endValue: number, progress: number) => number;
  };
  version: string;
}

declare global {
  interface Window {
    gsap: GSAPStatic;
    Draggable: DraggableStatic;
  }
}

// Need this to make it a module
export {};