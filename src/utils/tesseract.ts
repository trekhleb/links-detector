import {
  createWorker, createScheduler, Scheduler, Worker, WorkerOptions,
} from 'tesseract.js';
import { buildLoggers } from './logger';

export type InitSchedulerProps = {
  workersNum: number,
  language: string,
  onError?: (error: any) => void,
  onLoading?: (progress: number) => void, // [0, 1]
};

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

export type LoadingStages = WorkerLoadingStatuses[][];

const loadingStages: LoadingStages = [
  [
    WorkerLoadingStatuses.LoadingCore,
  ],
  [
    WorkerLoadingStatuses.Initializing,
    WorkerLoadingStatuses.Initialized,
  ],
  [
    WorkerLoadingStatuses.LoadingLanguageTrainData,
    WorkerLoadingStatuses.LoadingLanguageTrainDataCached,
    WorkerLoadingStatuses.LoadedLanguageTrainData,
  ],
  [
    WorkerLoadingStatuses.InitializingAPI,
    WorkerLoadingStatuses.InitializedAPI,
  ],
];

export type WorkerLogEvent = {
  status: WorkerLoadingStatuses,
  workerId?: string,
  progress?: number, // [0, 1]
};

const getLoadingProgressFromLog = (
  scheduler: Scheduler,
  logEvent: WorkerLogEvent,
): number | null => {
  if (!logEvent || !logEvent.status) {
    return null;
  }
  const eventStageIndex: number = loadingStages.findIndex(
    (stageStatuses: WorkerLoadingStatuses[]) => stageStatuses.includes(logEvent.status),
  );
  if (eventStageIndex === -1) {
    return null;
  }
  const totalStagesNum: number = loadingStages.length;
  const currentStageProgress: number = typeof logEvent.progress === 'number' ? logEvent.progress : 0;
  return eventStageIndex / totalStagesNum + currentStageProgress / totalStagesNum;
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

  const scheduler: Scheduler = createScheduler();

  const onWorkerLog = (logEvent: WorkerLogEvent): void => {
    const progress: number | null = getLoadingProgressFromLog(scheduler, logEvent);
    logger.logDebug('worker log', {
      ...logEvent,
      calcProgress: progress,
      loadedWorkersNum: scheduler.getNumWorkers(),
    });
    onLoading(progress || 0);
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
    const worker: Worker = createWorker(workerOptions);
    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    return worker;
  };

  let workers: Worker[] = [];
  try {
    const workersPromises: Promise<Worker>[] = Array(workersNum)
      .fill(null)
      .map(() => initWorker());
    workers = await Promise.all(workersPromises);
  } catch (error) {
    logger.logError('Cannot init workers', { error });
    onError(error);
  }

  workers.forEach((worker: Worker) => {
    const workerID = scheduler.addWorker(worker);
    logger.logDebug('addWorker', { workerID });
  });

  return scheduler;
};
