type LoggerContext = string | null;
type LoggerMessage = string;
type LoggerMeta = Error | Object | null;

type UseLoggerParams = {
  context?: LoggerContext,
};

type Logger = (
  message: LoggerMessage,
  meta?: LoggerMeta,
) => void;

type Loggers = {
  logDebug: Logger,
  logInfo: Logger,
  logWarn: Logger,
  logError: Logger,
};

const contextSeparator = '→';

/* global Console */
function useLogger(params: UseLoggerParams = {}): Loggers {
  const {context} = params;

  const logger: Console = console;

  const buildLogger = (loggerFunc: (message?: any, ...optionalParams: any[]) => void): Logger => {
    return (message: LoggerMessage, meta?: LoggerMeta): void => {
      const args: (LoggerMessage | LoggerContext| LoggerMeta)[] = [message];
      if (context) {
        args.unshift(context, contextSeparator);
      }
      if (meta) {
        args.push(meta);
      }
      loggerFunc(...args);
    };
  };

  return {
    logDebug: buildLogger(logger.info),
    logInfo: buildLogger(logger.info),
    logWarn: buildLogger(logger.warn),
    logError: buildLogger(logger.error),
  };
}

export default useLogger;
