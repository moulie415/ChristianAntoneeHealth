import React, {ReactNode} from 'react';
import auth from '@react-native-firebase/auth';
// import Shake from '@shakebugs/react-native-shake';
import crashlytics from '@react-native-firebase/crashlytics';
import VersionNumber from 'react-native-version-number';
import {connect} from 'react-redux';
import MoreProps from '../../../types/views/More';
import styles from '../../../styles/views/More';
import {Alert, SafeAreaView, Share} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {setLoggedIn} from '../../../actions/profile';
import colors from '../../../constants/colors';
import {Divider, Layout, List, ListItem} from '@ui-kitten/components';
import {resetToWelcome} from '../../../RootNavigation';
import {MyRootState} from '../../../types/Shared';
import Purchases from 'react-native-purchases';
import {STORE_LINK} from '../../../constants';
import {rateApp} from '../../../helpers';
import DevicePixels from '../../../helpers/DevicePixels';
import messaging from '@react-native-firebase/messaging';
import UnreadRowCount from '../../commons/unread/UnreadRowCount';

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
          resetToWelcome();
          await auth().signOut();
          messaging().deleteToken();
          Purchases.logOut();
          setLoggedInAction(false);
        },
      },
    ]);
  };
  const listItems: {
    title: string;
    icon: string;
    onPress?: () => void;
    accessoryRight?: () => ReactNode;
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
      accessoryRight: () =>
        profile.premium ? (
          <UnreadRowCount />
        ) : (
          <Icon name="lock" size={DevicePixels[15]} />
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
          title: 'Health and Movement',
          url: STORE_LINK,
          message: STORE_LINK,
        }),
    },
    {
      title: 'Rate the app',
      icon: 'star',
      onPress: rateApp,
    },
    {
      title: 'Goal Summary',
      icon: 'bullseye',
      onPress: () => navigation.navigate('GoalSummary'),
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
    <Layout>
      <SafeAreaView>
        <List
          data={listItems}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({item}) => (
            <ListItem
              title={item.title}
              accessoryLeft={() => (
                <Icon
                  size={DevicePixels[20]}
                  color={colors.appBlack}
                  solid
                  name={item.icon}
                />
              )}
              accessoryRight={
                item.accessoryRight ? item.accessoryRight : () => null
              }
              onPress={item.onPress}
            />
          )}
        />
      </SafeAreaView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedInAction: setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
