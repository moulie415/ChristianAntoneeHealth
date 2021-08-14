import Purchases from 'react-native-purchases';
import crashlytics from '@react-native-firebase/crashlytics';

export const setUserAttributes = (attributes: {[key: string]: string}) => {
  Purchases.setAttributes(attributes);
  crashlytics().setAttributes(attributes);
};
