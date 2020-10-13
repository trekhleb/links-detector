import {
  createWorker, createScheduler, Scheduler, Worker, WorkerOptions,
} from 'tesseract.js';
import { buildLoggers } from './logger';

type InitSchedulerProps = {
  workersNum: number,
  language: string,
};

const initScheduler = async (props: InitSchedulerProps): Promise<Scheduler> => {
  const { workersNum, language } = props;

  const logger = buildLoggers({ context: 'initScheduler' });
  logger.logDebug('initScheduler');

  const scheduler: Scheduler = createScheduler();

  const workerOptions: Partial<WorkerOptions> = {
    logger: (arg: any): void => {
      logger.logDebug('worker', arg);
    },
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
  }

  workers.forEach((worker: Worker) => {
    scheduler.addWorker(worker);
  });

  return scheduler;
};
