import * as Sentry from '@sentry/react-native';
import crashlytics from '@react-native-firebase/crashlytics';

export const logError = (e: Error) => {
  Sentry.captureException(e);
  crashlytics().recordError(e);
};
