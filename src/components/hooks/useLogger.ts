export type Logger = {
  logInfo: (message: string) => void,
  logWarn: (message: string) => void,
  logError: (message: string) => void,
};

function useLogger(): Logger {
  const logger: Console = console;

  const logInfo = (message: string): void => {
    logger.log(message);
  };

  const logWarn = (message: string): void => {
    logger.warn(message);
  };

  const logError = (message: string): void => {
    logger.error(message);
  };

  return {
    logInfo,
    logWarn,
    logError,
  };
}

export default useLogger;
