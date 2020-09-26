import { useRef } from 'react';

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
  const args: (LoggerMessage | LoggerContext| LoggerMeta)[] = [message];
  if (context) {
    args.unshift(context, contextSeparator);
  }
  if (meta) {
    args.push(meta);
  }
  loggerFunc(...args);
};

const logger: Console = console;

/* global Console */
function useLogger(params: UseLoggerParams = {}): Loggers {
  const { context } = params;

  const loggers = useRef<Loggers>({
    logDebug: buildLogger(logger.info, context),
    logInfo: buildLogger(logger.info, context),
    logWarn: buildLogger(logger.warn, context),
    logError: buildLogger(logger.error, context),
  });

  return loggers.current;
}

export default useLogger;
