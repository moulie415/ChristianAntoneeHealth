import * as Sentry from '@sentry/react-native';

export const ignoredErrors = [
  'firestore/permission-denied',
  'com.apple.healthkit Code=4',
];

export const logError = (e: Error | any) => {
  if (
    'message' in e &&
    ignoredErrors.some(ignored => e.message.includes(ignored))
  ) {
    return;
  }
  try {
    if (__DEV__) {
      console.warn(e);
    }
    if (!(e instanceof Error)) {
      Sentry.captureException(new Error(JSON.stringify(e)));
    } else {
      Sentry.captureException(e);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.warn(e);
    }
  }
};
