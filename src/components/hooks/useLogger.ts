type LoggerMessage = string;
type LoggerContext = string | null;
type LoggerMeta = Error | Object | null;

type Logger = (
  message: LoggerMessage,
  context?: LoggerContext,
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
function useLogger(): Loggers {
  const logger: Console = console;

  const buildLogger = (loggerFunc: (message?: any, ...optionalParams: any[]) => void): Logger => {
    return (message: LoggerMessage, context?: LoggerContext, meta?: LoggerMeta): void => {
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
