export const BASE_APP_PATH: string = '/';

export const DEBUG_GET_PARAM = 'debug';

export enum RouteNames {
  home = 'home',
  detector = 'detector',
  debug = 'debug',
}

type RouteType = {
  path: string,
};

type RoutesType = {
  [routeName in RouteNames]: RouteType;
};

export const ROUTES: RoutesType = {
  [RouteNames.home]: {
    path: '/',
  },
  [RouteNames.detector]: {
    path: '/detector',
  },
  [RouteNames.debug]: {
    path: '/debug',
  },
};

export const HOME_ROUTE: RouteType = ROUTES.home;
