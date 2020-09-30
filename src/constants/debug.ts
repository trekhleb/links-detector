import { DEBUG_GET_PARAM } from './routes';

export const isDebugMode = (): boolean => {
  const url = new URL(window.location.href);
  return !!url.searchParams.get(DEBUG_GET_PARAM);
};
