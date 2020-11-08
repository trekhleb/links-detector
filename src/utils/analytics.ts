import { Location, Action } from 'history';
import { buildLoggers } from './logger';
import { GOOGLE_ANALYTICS_ID } from '../configs/analytics';
/* global Gtag */
import EventNames = Gtag.EventNames;

const getPathFromLocation = (location: Location): string => {
  let path = location.pathname;
  if (location.search) {
    path += location.search;
  }
  if (location.hash) {
    path += location.hash;
  }
  return path;
};

export const gaPageView = (location: Location, action: Action): void => {
  const logger = buildLoggers({ context: 'gaPageView' });

  const path: string = getPathFromLocation(location);

  logger.logDebug('call', { location, action, path });

  if (!window.gtag) {
    return;
  }

  // @see: https://developers.google.com/gtagjs/reference/api#config
  window.gtag('config', GOOGLE_ANALYTICS_ID, {
    page_path: path,
  });
};

export const gaErrorLog = (errorType: string, errorMessage: string): void => {
  const logger = buildLoggers({ context: 'gaErrorLog' });
  logger.logDebug('call', { errorType, errorMessage });

  if (!window.gtag) {
    return;
  }

  const eventName: EventNames = 'exception';

  // @see: https://developers.google.com/gtagjs/reference/api#config
  window.gtag('config', GOOGLE_ANALYTICS_ID);

  // @see: https://developers.google.com/gtagjs/reference/event#exception
  window.gtag('event', eventName, {
    type: errorType,
    description: errorMessage,
  });
};
