export const generateValues = (start: number, end: number, step: number) => {
  const weights = [];
  for (let i = start; i <= end; i += step) {
    weights.push(parseFloat(i.toFixed(1)));
  }
  return weights;
};
