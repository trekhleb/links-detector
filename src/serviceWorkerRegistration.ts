// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

import { buildLoggers } from './utils/logger';

const logger = buildLoggers({ context: 'swRegistration' });

const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

function registerValidSW(swUrl: string, config?: Config): void {
  logger.logDebug('registerValidSW');
  navigator.serviceWorker
    .register(swUrl)
    .then((registration: ServiceWorkerRegistration) => {
      logger.logDebug('registerValidSW: registered');
      // eslint-disable-next-line no-param-reassign
      registration.onupdatefound = (): void => {
        const installingWorker = registration.installing;
        logger.logDebug('registerValidSW: onupdatefound', { installingWorker });
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = (): void => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              // @see: https://bit.ly/CRA-PWA
              logger.logDebug(
                'registerValidSW: New content is available and will be used when all tabs for this page are closed',
                {
                  state: installingWorker.state,
                  controller: navigator.serviceWorker.controller,
                },
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached. It's the perfect time to display a
              // "Content is cached for offline use." message.
              logger.logDebug(
                'registerValidSW: Content is cached for offline use',
                {
                  state: installingWorker.state,
                  controller: navigator.serviceWorker.controller,
                },
              );

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error: Error) => {
      logger.logError('Error during service worker registration:', error);
    });
}

export function register(config?: Config): void {
  if (!isServiceWorkerSupported()) {
    logger.logDebug('register: no supported');
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.logDebug('register: not a production environment');
    return;
  }

  // The URL constructor is available in all browsers that support SW.
  const publicUrl = new URL(
    process.env.PUBLIC_URL,
    window.location.href,
  );
  logger.logDebug('register', {
    publicUrlString: publicUrl.toString(),
  });

  if (publicUrl.origin !== window.location.origin) {
    // Our service worker won't work if PUBLIC_URL is on a different origin
    // from what our page is served on. This might happen if a CDN is used to
    // serve assets; see https://github.com/facebook/create-react-app/issues/2374
    logger.logError('register: PUBLIC_URL is on a different origin', {
      publicURLOrigin: publicUrl.origin,
      locationOrigin: window.location.origin,
    });
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    logger.logDebug('register: window loaded', { swUrl });
    registerValidSW(swUrl, config);
  });
}

export function unregister(): void {
  logger.logDebug('unregister');
  if (!isServiceWorkerSupported()) {
    logger.logDebug('unregister: not supported');
    return;
  }
  navigator.serviceWorker.ready
    .then((registration: ServiceWorkerRegistration) => {
      logger.logDebug('unregister: starting');
      registration.unregister()
        .then((result) => {
          logger.logDebug('unregister: finished', { result });
        })
        .catch((error) => {
          logger.logError('unregister: failed', { error });
        });
    })
    .catch((error: Error) => {
      logger.logError(`unregister: failed: ${error.message}`, { error });
    });
}
