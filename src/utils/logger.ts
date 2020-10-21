import { isDebugMode } from '../constants/debug';

export type LoggerContext = string | null;
export type LoggerMessage = string;
export type LoggerMeta = Error | Object | null;

export type TableLogger = (
  message: string,
  tabularData: any,
  properties?: string[],
) => void;

export type Logger = (
  message: LoggerMessage,
  meta?: LoggerMeta,
) => void;

export type Loggers = {
  logDebugTable: TableLogger,
  logDebug: Logger,
  logInfo: Logger,
  logWarn: Logger,
  logError: Logger,
};

const contextSeparator = '→';

const buildLogger = (
  loggerFunc: (message?: any, ...optionalParams: any[]) => void,
  context?: LoggerContext,
  muted?: boolean,
): Logger => (message: LoggerMessage, meta?: LoggerMeta): void => {
  if (muted) {
    return;
  }
  const args: (LoggerMessage | LoggerContext | LoggerMeta)[] = [message];
  if (context) {
    args.unshift(context, contextSeparator);
  }
  if (meta) {
    args.push(meta);
  }
  loggerFunc(...args);
};

const buildTableLogger = (
  loggerFunc: (tabularData: any, properties?: string[]) => void,
  context?: LoggerContext,
  muted?: boolean,
): TableLogger => (message: string, tabularData: any, properties?: string[]): void => {
  if (muted) {
    return;
  }
  loggerFunc(tabularData, properties);
};

/* global Console */
const logger: Console = console;

type BuildLoggersParams = {
  context?: LoggerContext,
};

export const buildLoggers = (params: BuildLoggersParams): Loggers => {
  const { context } = params;
  const muted = !isDebugMode();
  return {
    logDebugTable: buildTableLogger(logger.table, context, muted),
    logDebug: buildLogger(logger.info, context, muted),
    logInfo: buildLogger(logger.info, context, muted),
    logWarn: buildLogger(logger.warn, context),
    logError: buildLogger(logger.error, context),
  };
};
