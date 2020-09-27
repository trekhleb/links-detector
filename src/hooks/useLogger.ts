import { useRef } from 'react';
import { buildLoggers, LoggerContext, Loggers } from '../utils/logger';

type UseLoggerParams = {
  context?: LoggerContext,
};

function useLogger(params: UseLoggerParams = {}): Loggers {
  const { context } = params;
  const loggers = useRef<Loggers>(buildLoggers({ context }));
  return loggers.current;
}

export default useLogger;
