import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import HomeCard from '../commons/HomeCard';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Avatar from '../commons/Avatar';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Profile from '../../types/Profile';
import {
  TourGuideZone,
  TourGuideZoneByPosition,
  useTourGuideController,
} from 'rn-tourguide';
import {DrawerActions} from '@react-navigation/native';
import Header from '../commons/Header';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const ROW_MARGIN = DevicePixels[10] * RATIO;

type HomeNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

const Home: React.FC<{
  navigation: HomeNavigationProp;
  profile: Profile;
  viewedPlan: boolean;
  plansEnabled: boolean;
}> = ({navigation, profile, viewedPlan, plansEnabled}) => {
  const {eventEmitter} = useTourGuideController();
  useEffect(() => {
    if (!viewedPlan) {
      // navigation.navigate('Plan');
    }

    // navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation, viewedPlan]);

  const handleOnStepChange = useCallback(
    (step: {order?: number}) => {
      // if (step?.order === 3) {
      // }
    },
    [navigation],
  );

  useEffect(() => {
    eventEmitter.on('stepChange', handleOnStepChange);

    return () => {
      eventEmitter.off('stepChange', handleOnStepChange);
    };
  }, [eventEmitter, handleOnStepChange]);
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header showDrawerMenu />
        <ScrollView>
          <FastImage
            source={require('../../images/logo.png')}
            style={{
              width: DevicePixels[95],
              height: DevicePixels[84],
              margin: DevicePixels[40],
              marginTop: 0,
              alignSelf: 'center',
            }}
          />

          {/* <Text
            style={{
              marginLeft: DevicePixels[20],
              fontSize: DevicePixels[14],
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {`${greetingMessage()},`}
          </Text> */}
          {/* <Text
            style={{
              marginLeft: DevicePixels[20],
              marginBottom: DevicePixels[20],
              fontSize: DevicePixels[30],
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {profile.name?.split(' ')[0] || 'user'}
          </Text> */}

          <HomeCard
            title="New Workout"
            subtitle="Start a new workout now"
            image={require('../../images/Homepage_new_workout.jpeg')}
            onPress={() => navigation.navigate('Workout')}
          />
          <HomeCard
            title="Fitness tests"
            subtitle="Track your fitness overtime"
            image={require('../../images/Homepage_fitness_test.jpeg')}
            onPress={() => navigation.navigate('Fitness')}
          />

          <HomeCard
            title="Education"
            subtitle="Health and nutrition articles"
            image={require('../../images/education.jpeg')}
            onPress={() => navigation.navigate('Education')}
          />
          <HomeCard
            title="Saved workouts/tests"
            subtitle="View saved workouts, tests..."
            image={require('../../images/Homepage_Saved_Workouts.jpeg')}
            premium
            onPress={() => {
              if (profile.premium) {
                navigation.navigate('SavedItems');
              } else {
                navigation.navigate('Premium');
              }
            }}
          />

          <HomeCard
            title="Premium"
            subtitle="Explore premium features"
            image={require('../../images/Homepage_quick_routine.jpeg')}
            onPress={() => navigation.navigate('Premium')}
          />
          <HomeCard
            title="Rate the app"
            subtitle="Let us know what you think"
            image={require('../../images/Homepage_activity_tracking.jpeg')}
            onPress={() => navigation.navigate('Rating')}
          />
        </ScrollView>
      </SafeAreaView>
      <TourGuideZoneByPosition
        shape="circle"
        text="For everything else use this menu"
        isTourGuide
        top={DevicePixels[18] + insets.top}
        left={DevicePixels[13]}
        width={DevicePixels[30]}
        height={DevicePixels[30]}
        zone={profile.admin || plansEnabled ? 4 : 3}
      />
    </View>
  );
};

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  profile: profile.profile,
  viewedPlan: profile.viewedPlan,
  plansEnabled: settings.plansEnabled,
});

export default connect(mapStateToProps)(Home);
