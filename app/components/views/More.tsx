import React from 'react';
import InAppReview from 'react-native-in-app-review';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import {connect} from 'react-redux';
import MoreProps from '../../types/views/More';
import styles from '../../styles/views/More';
import {Alert, Share, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {setLoggedIn} from '../../actions/profile';
import colors from '../../constants/colors';
import {Divider, List, ListItem} from '@ui-kitten/components';
import {resetToLogin} from '../../RootNavigation';
import {MyRootState} from '../../types/Shared';

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
          resetToLogin();
          await auth().signOut();
          setLoggedInAction(false);
        },
      },
    ]);
  };
  const listItems: {title: string; icon: string; onPress: () => void}[] = [
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
    {title: 'Policies', icon: 'check-circle', onPress: () => 0},
    {
      title: 'Share the app',
      icon: 'share-alt',
      onPress: () => Share.share({title: 'Share', url: ''}),
    },
    {
      title: 'Rate the app',
      icon: 'star',
      onPress: InAppReview.RequestInAppReview,
    },
    {title: 'Log out', icon: 'sign-out-alt', onPress: logOut},
  ];

  if (profile.admin) {
    listItems.push({
      title: 'Force crash',
      icon: 'car-crash',
      onPress: crashlytics().crash,
    });
  }

  return (
    <List
      style={{}}
      data={listItems}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({item}) => (
        <ListItem
          title={item.title}
          accessoryLeft={() => (
            <Icon size={20} color={colors.appBlack} solid name={item.icon} />
          )}
          onPress={item.onPress}
        />
      )}
    />
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedInAction: setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
