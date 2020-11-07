import type { Location } from 'history';
// import { GOOGLE_ANALYTICS_ID } from '../configs/analytics';

export const gaPageView = (location: Location): string => {
  const pagePath: string = `${location.pathname}${location.search}`;
  return pagePath;
  // if (window.gtag) {
  //   window.gtag('config', GOOGLE_ANALYTICS_ID, {
  //     page_path: pagePath,
  //   });
  // }
};
