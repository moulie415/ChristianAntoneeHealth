import React, {ReactNode} from 'react';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import {
  Alert,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {setLoggedIn} from '../../../actions/profile';
import colors from '../../../constants/colors';
import {navigationRef, resetToWelcome} from '../../../RootNavigation';
import {MyRootState} from '../../../types/Shared';
import Purchases from 'react-native-purchases';
import {STORE_LINK} from '../../../constants';

import messaging from '@react-native-firebase/messaging';
import UnreadRowCount from '../../commons/unread/UnreadRowCount';
import {logError} from '../../../helpers/error';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import * as Sentry from '@sentry/react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import Profile from '../../../types/Profile';

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
interface Props {
  setLoggedInAction: (loggedIn: boolean) => void;
  profile: Profile;
  close: () => void;
}
const DrawerContent: React.FC<Props> = ({
  setLoggedInAction,
  profile,
  close,
}) => {
  const logOut = () => {
    Alert.alert('Are you sure?', '', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            close();
            resetToWelcome();
            await messaging().deleteToken();
            await Purchases.logOut();
            await auth().signOut();
            setLoggedInAction(false);
          } catch (e) {
            logError(e);
          }
        },
      },
    ]);
  };
  const listItems: ListItem[] = [
    {
      title: 'My profile',
      icon: 'user',
      onPress: () => {
        navigationRef.navigate('Profile');
        close();
      },
    },
    {
      title: 'Education',
      icon: 'book-open',
      onPress: () => {
        navigationRef.navigate('Education');
        close();
      },
    },

    {
      title: 'Friends',
      icon: 'user-friends',
      onPress: () => {
        close();
        if (profile.premium) {
          navigationRef.navigate('Connections');
        } else {
          navigationRef.navigate('Premium', {});
        }
      },
      accessoryRight: profile.premium ? (
        <UnreadRowCount />
      ) : (
        <Icon
          name="lock"
          size={20}
          style={{marginRight: 10}}
          color={colors.appWhite}
        />
      ),
    },
    {
      title: 'Premium',
      icon: 'trophy',
      onPress: () => {
        navigationRef.navigate('Premium', {});
        close();
      },
    },
    {
      title: 'About',
      icon: 'info-circle',
      onPress: () => {
        navigationRef.navigate('About');
        close();
      },
    },
    {
      title: 'Settings',
      icon: 'cog',
      onPress: () => {
        navigationRef.navigate('Settings'), close();
      },
    },
    {
      title: 'Support',
      icon: 'question-circle',
      onPress: () => {
        navigationRef.navigate('Support');
        close();
      },
    },
    {
      title: 'Share the app',
      icon: 'share-alt',
      onPress: () =>
        Share.share({
          title: 'CA Health',
          url: STORE_LINK,
          message: STORE_LINK,
        }),
    },
    {
      title: 'Rate the app',
      icon: 'star',
      onPress: () => {
        navigationRef.navigate('Rating');
        close();
      },
    },
    {title: 'Log out', icon: 'sign-out-alt', onPress: logOut},
  ];

  if (profile.admin) {
    listItems.push({
      title: 'Force crash (admin)',
      icon: 'car-crash',
      onPress: () => Sentry.nativeCrash(),
    });
  }

  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <FlatList
        data={listItems}
        contentContainerStyle={{marginTop: 40}}
        renderItem={({item}) => {
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

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedInAction: setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
