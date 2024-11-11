declare global {
  interface Window {
    gsap: {
      version: string;
      to: (target: any, vars: any) => any;
      set: (target: any, vars: any) => any;
      getProperty: (target: any, property: string) => any;
      registerPlugin: (...args: any[]) => void;
    };
    Draggable: {
      create: (target: Element, vars: any) => any;
      get: (target: Element) => any;
    };
  }
}

export {}; // This export is needed to make this a module