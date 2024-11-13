export const GRID_CONSTANTS = {
  INERTIA_DURATION: 1.0,     // Duration for our custom animations
  RESISTANCE: 0.3,           // Resistance for inertia
  SNAP_DURATION: 0.3,        // Snap animation duration
  SCROLL_SPEED: 1.5,         // Scroll speed multiplier
  SCROLL_SMOOTHING: 0.2,     // Scroll animation smoothing
  DRAG_RESISTANCE: 0.15,     // Resistance while dragging
  EDGE_RESISTANCE: 0.5,      // Resistance at edges
  OVERSHOOT_TOLERANCE: 0.8,  // How much overshoot is allowed
} as const;