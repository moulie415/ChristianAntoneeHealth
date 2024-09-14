import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import * as Sentry from '@sentry/react-native';
import React, {ReactNode} from 'react';
import {Alert, FlatList, Share, TouchableOpacity, View} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {LoginManager} from 'react-native-fbsdk-next';
import Purchases from 'react-native-purchases';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import {navigationRef, resetToWelcome} from '../../../RootNavigation';
import {STORE_LINK} from '../../../constants';
import colors from '../../../constants/colors';
import {logError} from '../../../helpers/error';
import {hasPremiumPlus} from '../../../helpers/hasPremiumPlus';
import useThrottle from '../../../hooks/UseThrottle';
import {setLoggedIn} from '../../../reducers/profile';
import {Profile} from '../../../types/Shared';
import Text from '../../commons/Text';
import UnreadRowCount from '../../commons/unread/UnreadRowCount';

export const MoreItem: React.FC<{item: ListItem}> = ({item}) => {
  return (
    <TouchableOpacity
      onPress={item.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      }}>
      <View
        style={{
          height: 35,
          width: 35,
          // backgroundColor: '#212121',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
        }}>
        <Icon size={20} color={colors.appWhite} solid name={item.icon} />
      </View>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 15,
        }}>
        {item.title}
      </Text>
      <View style={{alignItems: 'flex-end', flex: 1}}>
        {item.accessoryRight}
      </View>
    </TouchableOpacity>
  );
};

export interface ListItem {
  title: string;
  icon: string;
  onPress?: () => void;
  accessoryRight?: ReactNode;
  tourIndex?: number;
  tourText?: string;
}
interface Props extends DrawerContentComponentProps {
  setLoggedInAction: (loggedIn: boolean) => void;
  profile: Profile;
}
const DrawerContent: React.FC<Props> = ({
  setLoggedInAction,
  profile,
  navigation,
}) => {
  const onLogOut = useThrottle(async () => {
    try {
      const user = auth().currentUser;
      navigation.closeDrawer();
      resetToWelcome();
      await messaging().deleteToken();
      await Purchases.logOut();
      await auth().signOut();
      Sentry.setUser(null);
      try {
        if (
          user?.providerData?.find(data => data.providerId === 'google.com')
        ) {
          await GoogleSignin.signOut();
        }

        if (
          user?.providerData?.find(data => data.providerId === 'facebook.com')
        ) {
          LoginManager.logOut();
        }
      } catch (e) {
        logError(e);
      }
      setLoggedInAction(false);
    } catch (e) {
      logError(e);
    }
  }, 3000);

  const logOut = () => {
    Alert.alert('Are you sure?', '', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: onLogOut,
      },
    ]);
  };

  const messageItem =
    profile.client || profile.admin
      ? {
          title: 'Messaging',
          icon: 'comment',
          onPress: () => {
            navigation.closeDrawer();
            if (profile.admin || hasPremiumPlus(profile.premium)) {
              navigationRef.navigate('Connections');
            } else {
              navigationRef.navigate('Premium', {});
            }
          },
          accessoryRight:
            profile.admin || hasPremiumPlus(profile.premium) ? (
              <UnreadRowCount />
            ) : (
              <Icon
                name="lock"
                size={20}
                style={{marginRight: 10}}
                color={colors.appWhite}
              />
            ),
        }
      : null;

  const listItems: (ListItem | null)[] = [
    {
      title: 'Education',
      icon: 'book-open',
      onPress: () => {
        navigationRef.navigate('Education');
        navigation.closeDrawer();
      },
    },
    messageItem,
    {
      title: 'Recipes',
      icon: 'utensils',
      onPress: () => {
        navigationRef.navigate('RecipeCategories');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Fitness tests',
      icon: 'heart-pulse',
      onPress: () => {
        navigationRef.navigate('Fitness');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Premium',
      icon: 'crown',
      onPress: () => {
        navigationRef.navigate('Premium', {});
        navigation.closeDrawer();
      },
    },
    {
      title: 'About',
      icon: 'circle-info',
      onPress: () => {
        navigationRef.navigate('About');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Settings',
      icon: 'gear',
      onPress: () => {
        navigationRef.navigate('Settings');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Report a problem',
      icon: 'bug',
      onPress: () => {
        navigationRef.navigate('ReportProblem');
        navigation.closeDrawer();
      },
    },

    {
      title: 'Share the app',
      icon: 'share-nodes',
      onPress: () =>
        Share.share({
          title: 'CA Health',
          url: STORE_LINK,
          message: STORE_LINK,
        }),
    },
    {
      title: 'Give feedback',
      icon: 'star',
      onPress: () => {
        navigationRef.navigate('Rating');
        navigation.closeDrawer();
      },
    },
    {title: 'Log out', icon: 'right-from-bracket', onPress: logOut},
  ];

  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <FlatList
        data={listItems}
        contentContainerStyle={{marginTop: 40, paddingBottom: 80}}
        renderItem={({item}) => {
          if (!item) {
            return null;
          }
          return <MoreItem item={item} />;
        }}
      />
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 18,
          textAlign: 'center',
          margin: 10,
        }}>
        {`v${getVersion()} (${getBuildNumber()})`}
      </Text>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedInAction: setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
