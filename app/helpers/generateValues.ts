export const generateValues = (start: number, end: number, step: number) => {
  const values = [];
  for (let i = start; i <= end; i += step) {
    values.push(parseFloat(i.toFixed(1)));
  }
  return values;
};
