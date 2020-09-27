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
): Logger => (message: LoggerMessage, meta?: LoggerMeta): void => {
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
  return {
    logDebug: buildLogger(logger.info, context),
    logInfo: buildLogger(logger.info, context),
    logWarn: buildLogger(logger.warn, context),
    logError: buildLogger(logger.error, context),
  };
};
