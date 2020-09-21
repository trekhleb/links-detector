import {useEffect, useState} from 'react';
import useLogger from './useLogger';

type WindowSize = {
  width: number | undefined,
  height: number | undefined,
};

function useWindowSize(): WindowSize {
  const logger = useLogger({context: 'useWindowSize'});

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect((): () => void => {
    logger.logDebug('useEffect');

    function handleResize(): void {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return (): void => {
      logger.logDebug('useEffect return');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
