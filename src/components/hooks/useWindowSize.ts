import {useEffect, useState} from 'react';
import throttle from 'lodash/throttle';

import useLogger from './useLogger';

type WindowSize = {
  width: number | undefined,
  height: number | undefined,
};

const resizeThrottleMs = 200;

function useWindowSize(): WindowSize {
  const logger = useLogger({context: 'useWindowSize'});

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect((): () => void => {
    logger.logDebug('useEffect');

    const handleResize= (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    const handleResizeThrottled = throttle(
      handleResize,
      resizeThrottleMs,
      {
        leading: false,
        trailing: true,
      }
    );

    window.addEventListener('resize', handleResizeThrottled);

    handleResizeThrottled();

    return (): void => {
      logger.logDebug('useEffect return');
      window.removeEventListener('resize', handleResizeThrottled);
    };
  }, [logger]);

  return windowSize;
}

export default useWindowSize;
