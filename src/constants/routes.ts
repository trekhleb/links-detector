export const BASE_APP_PATH: string = '/';

enum RouteNames {
  home = 'home',
  detector = 'detector',
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
};

export const HOME_ROUTE = ROUTES.home;
