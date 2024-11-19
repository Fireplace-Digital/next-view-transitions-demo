export function moveArrayIndex(array: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}

// Define possible aspect ratios
const aspectRatios = [
  { width: 2, height: 1 },  // 2:1
  { width: 1, height: 1 },  // 1:1
  { width: 2, height: 3 },  // 2:3
  { width: 3, height: 2 }   // 3:2
];

// Get random aspect ratio
export function getRandomAspectRatio() {
  return aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
}

// Seed for consistent randomization per position
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function calculateDimensions(
  windowWidth: number,
  windowHeight: number,
  imgMidIndex: number,
  rowMidIndex: number
) {
  const winMidX = windowWidth / 2;
  const winMidY = windowHeight / 2;
  const boxWidth = windowWidth * 0.35;
  const boxHeight = windowHeight * 0.35;
  const gutter = windowWidth * 0.05;
  const horizSpacing = boxWidth + gutter;
  const vertSpacing = boxHeight + gutter;
  const horizOffset = -(imgMidIndex * horizSpacing + boxWidth / 2) + winMidX;
  const vertOffset = -(rowMidIndex * vertSpacing + boxHeight / 2) + winMidY;
  
  return {
    winMidX,
    winMidY,
    boxWidth,
    boxHeight,
    gutter,
    horizSpacing,
    vertSpacing,
    horizOffset,
    vertOffset
  };
}