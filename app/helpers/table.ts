export const keyHasValue = (table: any, key: string) => {
  for (let i = 0; i < 6; i++) {
    if (table[key][`col${i + 1}`].lower || table[key][`col${i + 1}`].higher) {
      return true;
    }
  }
  return false;
};
