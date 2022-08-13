import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const getProfileImage = (user: FirebaseAuthTypes.User) => {
  if (user.photoURL && user.providerData[0]) {
    const provider = user.providerData[0];
    if (provider.providerId === 'facebook.com') {
      return `${user.photoURL}?height=200`;
    }
    return user.photoURL;
  }
};

export const getTestImage = (index: number): any => {
  switch (index) {
    case 0:
      return require('../images/Fitness_testing_sit_and_reach.jpeg');
    case 1:
      return require('../images/Fitness_testing_plank.jpeg');
    case 2:
      return require('../images/Fitness_testing_step_test.jpeg');
    case 3:
      return require('../images/Fitness_testing_heart_rate_recovery.jpeg');
    case 4:
      return require('../images/Fitness_testing_squat.jpeg');
    default:
      return require('../images/Fitness_testing_push_up.jpeg');
  }
};

export const getImageThumbnail = (src: string) => {
  if (!src) {
    return;
  }
  const split = src.split('?');
  return `${split[0]}_200x200?${split[1]}`;
};
