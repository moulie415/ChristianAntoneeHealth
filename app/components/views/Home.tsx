import React, {useEffect} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {Dimensions, SafeAreaView} from 'react-native';

import HomeProps from '../../types/views/Home';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import HomeCard from '../commons/HomeCard';

import DevicePixels from '../../helpers/DevicePixels';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const ROW_MARGIN = DevicePixels[10] * RATIO;

const Home: React.FC<HomeProps> = ({navigation, profile, viewedPlan}) => {
  useEffect(() => {
    if (!viewedPlan) {
      navigation.navigate('Plan');
    }
  }, [navigation, viewedPlan]);
  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Text
          category="h3"
          style={{
            textAlign: 'center',
            padding: DevicePixels[20],
            marginVertical: DevicePixels[10],
          }}>{`Welcome ${profile.name || 'user'}`}</Text>

        <Layout style={{flex: 1}}>
          <Layout
            style={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: ROW_MARGIN,
            }}>
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
          </Layout>
          <Layout
            style={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: ROW_MARGIN,
            }}>
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
          </Layout>
          <Layout
            style={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: ROW_MARGIN,
            }}>
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
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  viewedPlan: profile.viewedPlan,
});

export default connect(mapStateToProps)(Home);
