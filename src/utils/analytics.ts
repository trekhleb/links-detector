import { Location } from 'history';
import { GOOGLE_ANALYTICS_ID } from '../configs/analytics';

const getPathFromLocation = (routerLocation: Location): string => {
  // @ts-ignore
  const documentLocation: Location | null = document && document.location;
  const location: Location = documentLocation || routerLocation;
  let path = location.pathname;
  if (location.search) {
    path += location.search;
  }
  if (location.hash) {
    path += location.hash;
  }
  return path;
};

const gTagSupported = (): boolean => {
  return window && window.gtag && true;
};

export const gaPageView = (location: Location): void => {
  if (!gTagSupported()) {
    return;
  }
  // @see: https://developers.google.com/gtagjs/reference/api#config
  window.gtag('config', GOOGLE_ANALYTICS_ID, {
    page_path: getPathFromLocation(location),
  });
};

export const gaErrorLog = (errorType: string, errorMessage: string): void => {
  if (!gTagSupported()) {
    return;
  }
  // @see: https://developers.google.com/gtagjs/reference/api#config
  window.gtag('config', GOOGLE_ANALYTICS_ID);
  // @see: https://developers.google.com/gtagjs/reference/event#exception
  window.gtag('event', 'exception', {
    type: errorType,
    description: errorMessage,
  });
};
