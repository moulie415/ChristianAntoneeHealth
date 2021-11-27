import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ImageSourcePropType} from 'react-native';

export const getProfileImage = (user: FirebaseAuthTypes.User) => {
  if (user.photoURL && user.providerData[0]) {
    const provider = user.providerData[0];
    if (provider.providerId === 'facebook.com') {
      return `${user.photoURL}?height=200`;
    }
    return user.photoURL;
  }
};

export const getTestImage = (name: string): any => {
  const lower = name.toLowerCase();
  if (lower.includes('cardio')) {
    return require('../images/Fitness_testing_step_test.jpeg');
  }
  if (lower.includes('aerobic')) {
    return require('../images/Fitness_testing_heart_rate_recovery.jpeg');
  }
  if (lower.includes('plank')) {
    return require('../images/Fitness_testing_plank.jpeg');
  }
  if (lower.includes('push up')) {
    return require('../images/Fitness_testing_push_up.jpeg');
  }
  if (lower.includes('sit and reach')) {
    return require('../images/Fitness_testing_sit_and_reach.jpeg');
  }
  return require('../images/Fitness_testing_squat.jpeg');
};
