import moment from 'moment';
import {useEffect, useRef, useState} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import {useAppState} from './UseAppState';

const useWorkoutTimer = (delay: number, notStarted?: boolean) => {
  const savedCallback = useRef<() => void>(null);
  const [seconds, setSeconds] = useState(0);
  const [timerPaused, setTimerPaused] = useState(false);

  const lastKnownTime = useRef<number>(null);
  const appState = useAppState();
  const [currentState, setCurrentState] = useState(appState);

  useEffect(() => {
    if (appState !== currentState) {
      setCurrentState(appState);
      const isForeground =
        currentState.match(/inactive|background/) && appState === 'active';
      if (isForeground && !timerPaused && lastKnownTime.current) {
        setSeconds(seconds + (moment().unix() - lastKnownTime.current));
      } else if (!isForeground && !timerPaused) {
        lastKnownTime.current = moment().unix();
      }
    }
  }, [appState, currentState, timerPaused, seconds]);

  useEffect(() => {
    savedCallback.current = () => {
      const isForeground = appState === 'active';
      if (!notStarted && !timerPaused && isForeground) {
        setSeconds(seconds + delay / 1000);
      }
    };
  }, [delay, notStarted, timerPaused, seconds, appState, currentState]);

  useEffect(() => {
    const id = BackgroundTimer.setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);
    return () => BackgroundTimer.clearInterval(id);
  }, [delay]);

  return {seconds, setTimerPaused, timerPaused};
};

export default useWorkoutTimer;
