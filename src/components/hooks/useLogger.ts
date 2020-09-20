export type LoggerContext = string | null;
export type LoggerMessage = string;

export type Logger = {
  logDebug: (message: LoggerMessage, context?: LoggerContext) => void,
  logInfo: (message: LoggerMessage, context?: LoggerContext) => void,
  logWarn: (message: LoggerMessage, context?: LoggerContext) => void,
  logError: (message: LoggerMessage, context?: LoggerContext, error?: Error) => void,
};

const contextSeparator = '→';

function useLogger(): Logger {
  const logger: Console = console;

  const logDebug = (message: LoggerMessage, context?: LoggerContext): void => {
    const args: string[] = [message];
    if (context) {
      args.unshift(context, contextSeparator);
    }
    logger.log(...args);
  };

  const logInfo = (message: LoggerMessage, context?: LoggerContext): void => {
    const args: string[] = [message];
    if (context) {
      args.unshift(context, contextSeparator);
    }
    logger.log(...args);
  };

  const logWarn = (message: LoggerMessage, context?: LoggerContext): void => {
    const args: string[] = [message];
    if (context) {
      args.unshift(context, contextSeparator);
    }
    logger.warn(...args);
  };

  const logError = (message: LoggerMessage, context?: LoggerContext, error?: Error): void => {
    const args: (string | Error)[] = [message];
    if (context) {
      args.unshift(context, contextSeparator);
    }
    if (error) {
      args.push(error);
    }
    logger.error(...args);
  };

  return {
    logDebug,
    logInfo,
    logWarn,
    logError,
  };
}

export default useLogger;
