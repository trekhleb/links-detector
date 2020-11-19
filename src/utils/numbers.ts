export const toFloatFixed = (num: number, fractionDigits: number): number => {
  const leverage: number = 10 ** fractionDigits;
  return Math.round(num * leverage) / leverage;
};

export const daysToSeconds = (days: number): number => {
  const secondsInDay: number = 24 * 60 * 60;
  return days * secondsInDay;
};
