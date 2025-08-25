import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { Permission } from 'react-native-health-connect';
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
      PERMS.Workout,
      PERMS.BodyFatPercentage,
      PERMS.ActiveEnergyBurned,
    ],
    write: [PERMS.Weight, PERMS.Workout, PERMS.Height, PERMS.BodyFatPercentage],
  },
};

export const healthConnectPermissions: Permission[] = [
  {
    accessType: 'read',
    recordType: 'ActiveCaloriesBurned',
  },
  {
    accessType: 'read',
    recordType: 'Steps',
  },
  {
    accessType: 'read',
    recordType: 'HeartRate',
  },
  {
    accessType: 'read',
    recordType: 'ActiveCaloriesBurned',
  },
  {
    accessType: 'read',
    recordType: 'ExerciseSession',
  },
  {
    accessType: 'write',
    recordType: 'ExerciseSession',
  },
  {
    accessType: 'read',
    recordType: 'Height',
  },
  {
    accessType: 'write',
    recordType: 'Height',
  },
  {
    accessType: 'read',
    recordType: 'Weight',
  },
  {
    accessType: 'write',
    recordType: 'Weight',
  },
  {
    accessType: 'read',
    recordType: 'BodyFat',
  },
  {
    accessType: 'write',
    recordType: 'BodyFat',
  },
  {
    accessType: 'read',
    recordType: 'BoneMass',
  },
  {
    accessType: 'write',
    recordType: 'BoneMass',
  },
];

export const SAMPLE_VIDEO_LINK =
  'https://cdn.videvo.net/videvo_files/video/free/2014-08/large_watermarked/Earth_Zoom_In_preview.mp4';

export const WORKOUT_LISTENER_SETUP = 'healthKit:Workout:setup:success';
export const WORKOUT_LISTENER_SETUP_FAILURE = 'healthKit:Workout:setup:failure';
export const WORKOUT_LISTENER = 'healthKit:Workout:new';
