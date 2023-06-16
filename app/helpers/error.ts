import * as Sentry from '@sentry/react-native';

export const logError = (e: Error | any) => {
  try {
    if (__DEV__) {
      console.warn(e);
    }
    Sentry.captureException(e);
  } catch (err) {
    if (err instanceof Error) {
      console.warn(e);
    }
  }
};
