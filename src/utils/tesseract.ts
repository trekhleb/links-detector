import {
  createWorker, createScheduler, Scheduler, Worker, WorkerOptions, WorkerParams, PSM,
} from 'tesseract.js';
import { buildLoggers } from './logger';
import { ZeroOneRange } from './types';
import { toFloatFixed } from './numbers';

export type InitSchedulerProps = {
  workersNum: number,
  language: string,
  onError?: (error: any) => void,
  onLoading?: (progress: ZeroOneRange) => void,
};

export enum JobTypes {
  Recognize = 'recognize',
  Detect = 'detect',
}

export enum WorkerLoadingStatuses {
  LoadingCore = 'loading tesseract core',
  Initializing = 'initializing tesseract',
  Initialized = 'initialized tesseract',
  LoadingLanguageTrainData = 'loading language traineddata',
  LoadingLanguageTrainDataCached = 'loading language traineddata (from cache)',
  LoadedLanguageTrainData = 'loaded language traineddata',
  InitializingAPI = 'initializing api',
  InitializedAPI = 'initialized api',
  RecognizingText = 'recognizing text',
}

const CORE_WORKER_ID = 'core';

type WorkerLoadingProgress = {
  [loadingState: string]: ZeroOneRange | null,
};

type WorkersLoadingProgress = {
  [workerId: string]: WorkerLoadingProgress,
};

export type WorkerLogEvent = {
  status: WorkerLoadingStatuses,
  workerId?: string,
  progress?: ZeroOneRange,
};

const getLoadingProgress = (
  originalWorkersLoadingProgress: WorkersLoadingProgress,
  workersNum: number,
): ZeroOneRange => {
  const workersLoadingProgress: WorkersLoadingProgress = { ...originalWorkersLoadingProgress };

  // Detect core loading progress.
  const coreNum: number = 1; // always 1
  const rawCoreLoadingProgress: WorkerLoadingProgress = workersLoadingProgress[
    CORE_WORKER_ID
  ] || {};
  const coreLoadingProgress: ZeroOneRange = rawCoreLoadingProgress[
    WorkerLoadingStatuses.LoadingCore
  ] || 0;
  delete workersLoadingProgress[CORE_WORKER_ID];

  // Detect workers loading progress.
  const rawWorkerProgresses: WorkerLoadingProgress[] = Object.values<WorkerLoadingProgress>(
    workersLoadingProgress,
  );
  if (!rawWorkerProgresses || !rawWorkerProgresses.length) {
    return 0;
  }
  const workerProgresses: ZeroOneRange[] = rawWorkerProgresses.map(
    (rawWorkerProgress: WorkerLoadingProgress) => {
      const tesseractLoadingProgress: ZeroOneRange = rawWorkerProgress[
        WorkerLoadingStatuses.Initialized
      ] || 0;

      const apiLoadingProgress: ZeroOneRange = rawWorkerProgress[
        WorkerLoadingStatuses.InitializedAPI
      ] || 0;

      const trainDataLoadingProgress: ZeroOneRange = rawWorkerProgress[
        WorkerLoadingStatuses.LoadedLanguageTrainData
      ] || 0;

      return (tesseractLoadingProgress + apiLoadingProgress + trainDataLoadingProgress) / 3;
    },
  );
  const denormalizedLoadingProgress: number = workerProgresses.reduce(
    (overallProgress: number, currentProgress: ZeroOneRange) => {
      return overallProgress + currentProgress;
    },
    0,
  );

  // Calculate overall loading progress.
  return toFloatFixed(
    (coreLoadingProgress + denormalizedLoadingProgress) / (workersNum + coreNum),
    2,
  );
};

export const initScheduler = async (props: InitSchedulerProps): Promise<Scheduler> => {
  const {
    workersNum,
    language,
    onError = (): void => {},
    onLoading = (): void => {},
  } = props;

  const logger = buildLoggers({ context: 'initScheduler' });
  logger.logDebug('initScheduler', { ...props });

  const workerIDs: string[] = [];
  const workersLoadingProgress: WorkersLoadingProgress = {};

  const scheduler: Scheduler = createScheduler();

  const onWorkerLog = (logEvent: WorkerLogEvent): void => {
    // Register a new loading state in worker loading progress object.
    const workerID: string = logEvent.workerId || CORE_WORKER_ID;
    if (!workersLoadingProgress[workerID]) {
      workersLoadingProgress[workerID] = {};
    }
    workersLoadingProgress[workerID][logEvent.status] = logEvent.progress || null;

    // Calculate overall loading progress.
    const progress: ZeroOneRange = getLoadingProgress(workersLoadingProgress, workersNum);
    logger.logDebug('worker log', {
      ...logEvent,
      overallProgress: progress,
      workersLoadingProgress: { ...workersLoadingProgress },
      loadedWorkersNum: scheduler.getNumWorkers(),
      workerIDs,
    });
    onLoading(progress);
  };

  const onWorkerError = (error: any): void => {
    logger.logError('worker error', { ...error });
    onError(error);
  };

  const workerOptions: Partial<WorkerOptions> = {
    logger: onWorkerLog,
    errorHandler: onWorkerError,
  };

  const initWorker = async (): Promise<Worker> => {
    // @see: https://github.com/naptha/tesseract.js/blob/master/docs/api.md#workersetparametersparams-jobid-promise
    const workerParams: Partial<WorkerParams> = {
      // @ts-ignore
      tessedit_pageseg_mode: PSM.SINGLE_LINE,
      tessjs_create_hocr: '0',
      tessjs_create_tsv: '0',
    };

    const worker: Worker = createWorker(workerOptions);
    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    await worker.setParameters(workerParams);

    return worker;
  };

  let workers: Worker[] = [];
  try {
    const workersPromises: Promise<Worker>[] = Array(workersNum)
      .fill(null)
      .map(() => initWorker());
    workers = await Promise.all(workersPromises);
  } catch (error) {
    logger.logError('cannot init workers', { error });
    onError(error);
  }

  workers.forEach((worker: Worker) => {
    const workerID = scheduler.addWorker(worker);
    workerIDs.push(workerID);
    logger.logDebug('addWorker', { workerID });
  });

  return scheduler;
};
