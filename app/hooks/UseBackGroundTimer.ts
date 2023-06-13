import {useEffect, useRef} from 'react';
import BackgroundTimer from 'react-native-background-timer';

const useBackgroundTimer = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);
    return () => BackgroundTimer.stopBackgroundTimer();
  }, [delay]);
};

export default useBackgroundTimer;
