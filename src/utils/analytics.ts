import { Location } from 'history';
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

export const gaPageView = (location: Location): void => {
  const path: string = getPathFromLocation(location);

  if (!window.gtag) {
    return;
  }

  // @see: https://developers.google.com/gtagjs/reference/api#config
  window.gtag('config', GOOGLE_ANALYTICS_ID, {
    page_path: path,
  });
};

export const gaErrorLog = (errorType: string, errorMessage: string): void => {
  if (!window.gtag) {
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
