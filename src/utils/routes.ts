import { ROUTES, RouteType } from '../constants/routes';

export const routeFromPath = (path: string): RouteType | null => {
  const route: RouteType | undefined = Object.values<RouteType>(ROUTES)
    .find((currentRoute: RouteType) => currentRoute.path === path);
  return route || null;
};

export const routeTitleFromPath = (path: string): string | null => {
  const route: RouteType | null = routeFromPath(path);
  if (route) {
    return route.title;
  }
  return null;
};
