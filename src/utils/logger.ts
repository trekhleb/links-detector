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

type BuildLoggerProps = {
  loggerFunc: (message?: any, ...optionalParams: any[]) => void,
  onCall?: (context: LoggerContext, message: LoggerMessage, meta?: LoggerMeta) => void,
  context?: LoggerContext,
  muted?: boolean,
};

const buildLogger = (
  props: BuildLoggerProps,
): Logger => (message: LoggerMessage, meta?: LoggerMeta): void => {
  const {
    loggerFunc,
    onCall,
    context,
    muted,
  } = props;

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

  if (onCall) {
    onCall(context || 'unknown', message, meta);
  }
};

type BuildTableLoggerProps = {
  loggerFunc: (tabularData: any, properties?: string[]) => void,
  context?: LoggerContext,
  muted?: boolean,
};

const buildTableLogger = (
  props: BuildTableLoggerProps,
): TableLogger => (message: string, tabularData: any, properties?: string[]): void => {
  const { loggerFunc, muted } = props;
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
    logDebugTable: buildTableLogger({
      loggerFunc: logger.table,
      context,
      muted,
    }),

    logDebug: buildLogger({
      loggerFunc: logger.info,
      context,
      muted,
    }),

    logInfo: buildLogger({
      loggerFunc: logger.info,
      context,
      muted,
    }),

    logWarn: buildLogger({
      loggerFunc: logger.warn,
      context,
    }),

    logError: buildLogger({
      loggerFunc: logger.error,
      context,
    }),
  };
};
