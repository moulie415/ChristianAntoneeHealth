import * as Sentry from '@sentry/react-native';

export const ignoredErrors = [
  'firestore/permission-denied',
  'error getting latest height',
  'An error occured saving the workoutError',
  'error saving body fat percent sampleError',
];

export const ignoredCodes = ['E(null)0', 'ECOM.APPLE.HEALTHKIT4'];

export const logError = (e: Error | any) => {
  if (
    'message' in e &&
    ignoredErrors.some(ignored => e.message.includes(ignored))
  ) {
    return;
  }

  if ('code' in e && ignoredCodes.some(ignored => e.code === ignored)) {
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
