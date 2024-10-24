export const roundUp = numberString => {
  const scale = Math.pow(10, 8);
  return Math.ceil(Number(numberString) * scale) / scale;
};
