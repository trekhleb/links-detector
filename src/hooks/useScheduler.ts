import { Scheduler } from 'tesseract.js';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { initScheduler, InitSchedulerProps } from '../utils/tesseract';
import useLogger from './useLogger';
import { ZeroOneRange } from '../utils/types';

type UseSchedulerProps = InitSchedulerProps;

type UseSchedulerOutput = {
  scheduler: Scheduler | null,
  loadingProgress: ZeroOneRange,
};

const useScheduler = (props: UseSchedulerProps): UseSchedulerOutput => {
  const { workersNum, language } = props;
  const [schedulerLoaded, setSchedulerLoaded] = useState(false);

  const scheduler = useRef<Scheduler | null>(null);

  const logger = useLogger({ context: 'useScheduler' });

  const onSchedulerLoading = (progress: number): void => {
    logger.logDebug('onSchedulerLoading', {
      workersNum: scheduler.current ? scheduler.current.getNumWorkers() : 0,
    });
  };

  const onSchedulerLoadingCallback = useCallback(onSchedulerLoading, [logger]);

  const onSchedulerError = (error: any): void => {};

  const onSchedulerErrorCallback = useCallback(onSchedulerError, []);

  useEffect(() => {
    if (scheduler && scheduler.current) {
      return;
    }
    logger.logDebug('useEffect');
    initScheduler({
      workersNum,
      language,
      onLoading: onSchedulerLoadingCallback,
      onError: onSchedulerErrorCallback,
    })
      .then((ocrScheduler: Scheduler) => {
        scheduler.current = ocrScheduler;
      });
  }, [workersNum, language, logger, onSchedulerErrorCallback, onSchedulerLoadingCallback]);

  return {
    scheduler: scheduler.current,
    loadingProgress: 0,
  };
};

export default useScheduler;
