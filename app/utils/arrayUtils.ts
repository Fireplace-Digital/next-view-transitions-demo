export function moveArrayIndex(array: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
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