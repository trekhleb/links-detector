import { Location, Action } from 'history';
import { buildLoggers } from './logger';
import { GOOGLE_ANALYTICS_ID } from '../configs/analytics';

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

  if (window.gtag) {
    window.gtag('config', GOOGLE_ANALYTICS_ID, {
      page_path: path,
    });
  }
};
