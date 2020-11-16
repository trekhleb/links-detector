import { isDebugMode } from '../constants/debug';
import { gaErrorLog } from './analytics';

export type LoggerContext = string | null;
export type LoggerMessage = string;
export type LoggerMeta = Error | Object | null;

interface LinksDetectorConsole {
  log(...data: any[]): void;
  table(tabularData?: any, properties?: string[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
}

const linksDetectorConsoleName: string = 'linksDetectorConsole';

function getSystemLogger(): LinksDetectorConsole {
  if (Object.prototype.hasOwnProperty.call(window, linksDetectorConsoleName)) {
    return window[linksDetectorConsoleName];
  }

  const linksDetectorConsole: LinksDetectorConsole = {
    log: window.console.log,
    table: window.console.table,
    warn: window.console.warn,
    error: window.console.error,
  };

  Object.defineProperty(window, linksDetectorConsoleName, {
    value: linksDetectorConsole,
    writable: false,
  });

  return linksDetectorConsole;
}

const logger: LinksDetectorConsole = getSystemLogger();

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

type OnCallLoggerCallback =
  (context: LoggerContext, message: LoggerMessage, meta?: LoggerMeta) => void;

type BuildLoggerProps = {
  loggerFunc: (message?: any, ...optionalParams: any[]) => void,
  onCall?: OnCallLoggerCallback,
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
    const consoleColors: string[] = [
      'green', 'orange', 'blue', 'brown', 'blueviolet', 'chocolate', 'coral', 'dodgerblue', 'olive', 'teal',
    ];
    const contextHash: number = context.length % consoleColors.length;
    const contextColor: string = consoleColors[contextHash];
    const contextStyles: string = `background: ${contextColor}; color: white; padding: 0 3px; border-radius: 3px;`;
    args.unshift(
      `%c${context}`,
      contextStyles,
      contextSeparator,
    );
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

const onGAError: OnCallLoggerCallback = (
  context: LoggerContext,
  message: LoggerMessage,
): void => {
  gaErrorLog(context || 'unknownContext', message);
};

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
      loggerFunc: logger.log,
      context,
      muted,
    }),

    logInfo: buildLogger({
      loggerFunc: logger.log,
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
      onCall: onGAError,
    }),
  };
};
