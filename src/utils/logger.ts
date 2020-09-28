import { isDebugMode } from '../constants/debugging';

export type LoggerContext = string | null;
export type LoggerMessage = string;
export type LoggerMeta = Error | Object | null;

export type Logger = (
  message: LoggerMessage,
  meta?: LoggerMeta,
) => void;

export type Loggers = {
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

/* global Console */
const logger: Console = console;

type BuildLoggersParams = {
  context?: LoggerContext,
};

export const buildLoggers = (params: BuildLoggersParams): Loggers => {
  const { context } = params;
  const muted = !isDebugMode();
  return {
    logDebug: buildLogger(logger.info, context, muted),
    logInfo: buildLogger(logger.info, context, muted),
    logWarn: buildLogger(logger.warn, context),
    logError: buildLogger(logger.error, context),
  };
};
