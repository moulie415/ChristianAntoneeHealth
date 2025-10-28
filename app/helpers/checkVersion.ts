import { navigate } from '../RootNavigation';
import { logError } from './error';
import * as Application from 'expo-application';

const compareVersions = (v1: string, v2: string) => {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part > v2Part) {
      return 1;
    }
    if (v1Part < v2Part) {
      return -1;
    }
  }
  return 0;
};

export const checkVersion = (minVersion?: string) => {
  try {
    if (!minVersion) {
      return;
    }

    if (!parseFloat(minVersion)) {
      return;
    }

    const version = Application.nativeApplicationVersion;

    if (!version || !parseFloat(version)) {
      return;
    }

    if (version && compareVersions(version, minVersion) < 0) {
      navigate('UpdatePrompt');
    }
  } catch (e) {
    logError(e);
  }
};
