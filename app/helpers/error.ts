import * as Sentry from '@sentry/react-native';

export const logError = (e: Error | any) => {
  if (__DEV__) {
    console.error(e);
  }
  Sentry.captureException(e);
};
