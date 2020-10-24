import { toFloatFixed } from './numbers';

export type Profiler = {
  start: () => void,
  stop: (inSeconds?: boolean) => number,
  avg: (inSeconds?: boolean) => number,
  fps: () => number,
  avgFps: () => number,
};

const msToSs = (timeMs: number, fractionDigits: number = 2): number => {
  return toFloatFixed(timeMs / 1000, fractionDigits);
};

export const newProfiler = (): Profiler => {
  let timeRangesSum: number = 0;
  let timeRangesNum: number = 0;
  let lastTimeRange: number = 0;

  let startTimeMs: number = 0;

  const start = (): void => {
    startTimeMs = Date.now();
  };

  const stop = (inSeconds: boolean = true): number => {
    const timeRange = Date.now() - startTimeMs;
    lastTimeRange = timeRange;
    timeRangesNum += 1;
    timeRangesSum += timeRange;
    if (inSeconds) {
      return msToSs(timeRange);
    }
    return timeRange;
  };

  const avg = (inSeconds: boolean = true): number => {
    const average = Math.ceil(timeRangesSum / timeRangesNum);
    if (inSeconds) {
      return msToSs(average);
    }
    return average;
  };

  const fps = (): number => {
    return toFloatFixed(1 / msToSs(lastTimeRange), 2);
  };

  const avgFps = (): number => {
    return toFloatFixed(1 / avg(), 2);
  };

  return {
    start,
    stop,
    avg,
    fps,
    avgFps,
  };
};
