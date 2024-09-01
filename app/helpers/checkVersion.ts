import {getVersion} from 'react-native-device-info';
import {navigate} from '../RootNavigation';
import {logError} from './error';

export const checkVersion = (latestVersion?: string) => {
  try {
    if (!latestVersion) {
      return;
    }
    const parsedLatestVersion = parseFloat(latestVersion);
    if (!parsedLatestVersion) {
      return;
    }

    const version = getVersion();

    const parsedVersion = parseFloat(version);

    if (parsedVersion && parsedVersion < parsedLatestVersion) {
      navigate('UpdatePrompt');
    }
  } catch (e) {
    logError(e);
  }
};
