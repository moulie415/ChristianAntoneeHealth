import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
import {Scopes} from 'react-native-google-fit';
const PERMS = AppleHealthKit.Constants.Permissions;

export default {
  spinner: 'MaterialIndicator',
  whiteSpaceRegex: /\s/,
  loremIpsum:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const healthKitOptions: HealthKitPermissions = {
  permissions: {
    read: [
      PERMS.DateOfBirth,
      PERMS.Weight,
      PERMS.Height,
      PERMS.HeartRate,
      PERMS.Steps,
      PERMS.StepCount,
      PERMS.BiologicalSex,
    ],
    write: [PERMS.Weight],
  },
};

export const googleFitOptions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
    Scopes.FITNESS_HEART_RATE_READ,
  ],
};

export const SAMPLE_VIDEO_LINK =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
