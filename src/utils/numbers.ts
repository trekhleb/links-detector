export const toFloatFixed = (num: number, fractionDigits: number): number => {
  const leverage: number = 10 ** fractionDigits;
  return Math.round(num * leverage) / leverage;
};
