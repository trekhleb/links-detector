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
  loaded: boolean,
  loadingProgress: ZeroOneRange,
};

const useTesseract = (props: UseSchedulerProps): UseSchedulerOutput => {
  const { workersNum, language } = props;
  const [loaded, setLoaded] = useState<boolean>(false);

  const scheduler = useRef<Scheduler | null>(null);

  const logger = useLogger({ context: 'useTesseract' });

  const onSchedulerLoading = (progress: number): void => {
    logger.logDebug('onSchedulerLoading', {
      workersNum: scheduler.current ? scheduler.current.getNumWorkers() : 0,
    });
  };

  const onSchedulerLoadingCallback = useCallback(onSchedulerLoading, [logger]);

  const onSchedulerError = (error: any): void => {};

  const onSchedulerErrorCallback = useCallback(onSchedulerError, []);

  useEffect(() => {
    logger.logDebug('useEffect');
    if (scheduler && scheduler.current) {
      logger.logDebug('useEffect: skip');
      return;
    }
    initScheduler({
      workersNum,
      language,
      onLoading: onSchedulerLoadingCallback,
      onError: onSchedulerErrorCallback,
    })
      .then((ocrScheduler: Scheduler) => {
        logger.logDebug('useEffect: init finished', {
          ocrScheduler,
          workersNum: ocrScheduler.getNumWorkers(),
          queueLen: ocrScheduler.getQueueLen(),
        });
        scheduler.current = ocrScheduler;
        setLoaded(true);
      });
  }, [workersNum, language, logger, onSchedulerErrorCallback, onSchedulerLoadingCallback]);

  return {
    scheduler: scheduler.current,
    loadingProgress: 0,
    loaded,
  };
};

export default useTesseract;
