import { APP_TITLE, APP_TITLE_SEPARATOR } from './page';

export const BASE_APP_PATH: string = '/links-detector';

export const DEBUG_GET_PARAM = 'debug';

export enum RouteNames {
  home = 'home',
  detector = 'detector',
  debug = 'debug',
}

export type RouteType = {
  path: string,
  title: string,
};

export type RoutesType = {
  [routeName in RouteNames]: RouteType;
};

export const generateAppTitle = (pageTitle: string): string => {
  return `${APP_TITLE}${APP_TITLE_SEPARATOR}${pageTitle}`;
};

export const ROUTES: RoutesType = {
  [RouteNames.home]: {
    path: '/',
    title: generateAppTitle('Home'),
  },
  [RouteNames.detector]: {
    path: '/detector',
    title: generateAppTitle('Detection'),
  },
  [RouteNames.debug]: {
    path: '/debug',
    title: generateAppTitle('Debug'),
  },
};

export const HOME_ROUTE: RouteType = ROUTES.home;
