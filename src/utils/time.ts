export const msToSs = (timeMs: number, fractionDigits: number = 2): string => {
  const ss = (timeMs / 1000).toFixed(fractionDigits);
  return `${ss}s`;
};
