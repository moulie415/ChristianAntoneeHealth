import React, {useEffect} from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeProps from '../../types/views/Home';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import HomeCard from '../commons/HomeCard';
import DevicePixels from '../../helpers/DevicePixels';
import Text from '../commons/Text';
import {greetingMessage} from '../../helpers';
import colors from '../../constants/colors';
import Avatar from '../commons/Avatar';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const ROW_MARGIN = DevicePixels[10] * RATIO;

const Home: React.FC<HomeProps> = ({navigation, profile, viewedPlan}) => {
  useEffect(() => {
    if (!viewedPlan) {
      // navigation.navigate('Plan');
    }
  }, [navigation, viewedPlan]);
  return (
    <ScrollView>
      <ImageBackground
        source={require('../../images/login.jpeg')}
        blurRadius={5}
        style={{flex: 1}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.appBlack,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: DevicePixels[20],
          }}>
          <View />
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{
              width: DevicePixels[40],
              height: DevicePixels[40],
              borderRadius: DevicePixels[20],
              backgroundColor: colors.appWhite,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar
              src={profile.avatar}
              size={DevicePixels[38]}
              name={profile.name}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            marginLeft: DevicePixels[20],
            fontSize: DevicePixels[14],
            color: colors.appWhite,
            fontWeight: 'bold',
          }}>
          {`${greetingMessage()},`}
        </Text>
        <Text
          style={{
            marginLeft: DevicePixels[20],
            marginBottom: DevicePixels[20],
            fontSize: DevicePixels[30],
            color: colors.appWhite,
            fontWeight: 'bold',
          }}>
          {profile.name?.split(' ')[0] || 'user'}
        </Text>

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
      </ImageBackground>
    </ScrollView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  viewedPlan: profile.viewedPlan,
});

export default connect(mapStateToProps)(Home);
