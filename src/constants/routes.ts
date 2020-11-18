import { APP_TITLE, APP_TITLE_SEPARATOR } from './page';

export const BASE_APP_PATH: string = '/links-detector';
export const BASE_VIDEO_PATH: string = `${BASE_APP_PATH}/videos`;

// The BASE_ROUTE_PATH may be different from BASE_APP_PATH path in case of a hash router.
// Compare /links-detector/#/home (hash router) vs /links-detector/home (history router)
export const BASE_ROUTE_PATH: string = '/';

export const DEBUG_GET_PARAM = 'debug';

export enum RouteNames {
  home = 'home',
  detector = 'detector',
  debug = 'debug',
  demo = 'demo',
}

export type RouteType = {
  path: string,
  title: string,
};

export type RoutesType = {
  [routeName in RouteNames]: RouteType;
};

const generateAppTitle = (pageTitle: string): string => {
  return `${APP_TITLE}${APP_TITLE_SEPARATOR}${pageTitle}`;
};

const generatePath = (path: string): string => {
  if (path === '/') {
    return BASE_ROUTE_PATH;
  }
  if (BASE_ROUTE_PATH === '/') {
    return path;
  }
  return `${BASE_ROUTE_PATH}${path}`;
};

export const ROUTES: RoutesType = {
  [RouteNames.home]: {
    path: generatePath('/'),
    title: generateAppTitle('Start'),
  },
  [RouteNames.detector]: {
    path: generatePath('/detector'),
    title: generateAppTitle('Scanning'),
  },
  [RouteNames.debug]: {
    path: generatePath('/debug'),
    title: generateAppTitle('Debug'),
  },
  [RouteNames.demo]: {
    path: generatePath('/demo'),
    title: generateAppTitle('Demo'),
  },
};

export const HOME_ROUTE: RouteType = ROUTES.home;
