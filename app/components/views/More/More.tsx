import React, {ReactNode} from 'react';
import auth from '@react-native-firebase/auth';
// import Shake from '@shakebugs/react-native-shake';
import crashlytics from '@react-native-firebase/crashlytics';
import VersionNumber from 'react-native-version-number';
import {connect} from 'react-redux';
import MoreProps from '../../../types/views/More';
import styles from '../../../styles/views/More';
import {
  Alert,
  FlatList,
  ImageBackground,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {setLoggedIn} from '../../../actions/profile';
import colors from '../../../constants/colors';
import {resetToWelcome} from '../../../RootNavigation';
import {MyRootState} from '../../../types/Shared';
import Purchases from 'react-native-purchases';
import {STORE_LINK} from '../../../constants';
import DevicePixels from '../../../helpers/DevicePixels';
import messaging from '@react-native-firebase/messaging';
import UnreadRowCount from '../../commons/unread/UnreadRowCount';
import Divider from '../../commons/Divider';
import ListItem from '../../commons/ListItem';
import {logError} from '../../../helpers/error';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

const More: React.FC<MoreProps> = ({
  navigation,
  setLoggedInAction,
  profile,
}) => {
  const logOut = () => {
    Alert.alert('Are you sure?', '', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
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
  const listItems: {
    title: string;
    icon: string;
    onPress?: () => void;
    accessoryRight?: ReactNode;
  }[] = [
    {
      title: 'Education',
      icon: 'book-open',
      onPress: () => navigation.navigate('Education'),
    },
    {
      title: 'My profile',
      icon: 'user',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'Connections',
      icon: 'user-friends',
      onPress: () => {
        if (profile.premium) {
          navigation.navigate('Connections');
        } else {
          navigation.navigate('Premium');
        }
      },
      accessoryRight: profile.premium ? (
        <UnreadRowCount />
      ) : (
        <Icon
          name="lock"
          size={DevicePixels[20]}
          style={{marginRight: DevicePixels[10]}}
          color={colors.appWhite}
        />
      ),
    },
    {
      title: 'Premium',
      icon: 'trophy',
      onPress: () => navigation.navigate('Premium'),
    },
    {
      title: 'About us',
      icon: 'info-circle',
      onPress: () => navigation.navigate('About'),
    },
    {
      title: 'Settings',
      icon: 'cog',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Support',
      icon: 'question-circle',
      onPress: () => navigation.navigate('Support'),
    },
    {
      title: 'Policies',
      icon: 'check-circle',
      onPress: () => navigation.navigate('Policies'),
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
      onPress: () => navigation.navigate('Rating'),
    },
    // {
    //   title: 'Report a problem',
    //   icon: 'bug',
    //   onPress: () => Shake.show(),
    // },
    {title: 'Log out', icon: 'sign-out-alt', onPress: logOut},
    {
      title: `v${VersionNumber.appVersion} (${VersionNumber.buildVersion})`,
      icon: 'code',
    },
  ];

  if (profile.admin) {
    listItems.push({
      title: 'Force crash (admin)',
      icon: 'car-crash',
      onPress: crashlytics().crash,
    });
  }

  return (
    <FastImage
      source={require('../../../images/premium.jpg')}
      blurRadius={7}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.8,
        }}
      />
      <SafeAreaView>
        <FlatList
          data={listItems}
          contentContainerStyle={{marginTop: DevicePixels[20]}}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={item.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: DevicePixels[10],
              }}>
              <View
                style={{
                  height: DevicePixels[35],
                  width: DevicePixels[35],
                  backgroundColor: '#212121',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: DevicePixels[5],
                }}>
                <Icon
                  size={DevicePixels[20]}
                  color={colors.appWhite}
                  solid
                  name={item.icon}
                />
              </View>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[18],
                  fontWeight: 'bold',
                  marginLeft: DevicePixels[15],
                }}>
                {item.title}
              </Text>
              <View style={{alignItems: 'flex-end', flex: 1}}>
                {item.accessoryRight}
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedInAction: setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
