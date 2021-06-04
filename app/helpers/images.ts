import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const getProfileImage = (user: FirebaseAuthTypes.User) => {
  if (user.photoURL && user.providerData[0]) {
    const provider = user.providerData[0];
    if (provider.providerId === 'facebook.com') {
      return `${user.photoURL}?height=200`;
    }
    return user.photoURL;
  }
};
