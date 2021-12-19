import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {Dimensions, Linking, Platform, SafeAreaView} from 'react-native';
import GoogleFit from 'react-native-google-fit';
import HomeProps from '../../types/views/Home';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import HomeWelcome from './HomeWelcome';
import HomeCard from '../commons/HomeCard';
import {linkToGoogleFit} from '../../helpers/biometrics';
import DevicePixels from '../../helpers/DevicePixels';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const ROW_MARGIN = DevicePixels[10] * RATIO;

const Home: React.FC<HomeProps> = ({navigation, profile, hasViewedWelcome}) => {
  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Text
          category="h3"
          style={{
            textAlign: 'center',
            padding: DevicePixels[20],
            marginVertical: DevicePixels[10],
          }}>{`Welcome ${profile.name || 'user'}!`}</Text>
        {!hasViewedWelcome && <HomeWelcome />}
        {hasViewedWelcome && (
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
                delay={200}
              />
              <HomeCard
                title="Fitness tests"
                subtitle="Track your fitness overtime"
                image={require('../../images/Homepage_fitness_test.jpeg')}
                onPress={() => navigation.navigate('Fitness')}
                delay={400}
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
                image={require('../../images/Homepage_Education.jpeg')}
                onPress={() => navigation.navigate('Education')}
                delay={600}
              />
              <HomeCard
                title="Saved workouts/tests"
                subtitle="View saved workouts, tests..."
                image={require('../../images/Homepage_Saved_Workouts.jpeg')}
                onPress={() => {
                  if (profile.premium) {
                    navigation.navigate('SavedItems');
                  } else {
                    navigation.navigate('Premium');
                  }
                }}
                delay={800}
              />
            </Layout>
            <Layout
              style={{
                flex: 1,
                flexDirection: 'row',
                marginBottom: ROW_MARGIN,
              }}>
              <HomeCard
                title="Quick routines"
                subtitle="View premade routines"
                image={require('../../images/Homepage_quick_routine.jpeg')}
                onPress={() => navigation.navigate('QuickRoutines')}
                delay={1000}
              />
              <HomeCard
                title="View Activity"
                subtitle="Track you daily activity"
                image={require('../../images/Homepage_activity_tracking.jpeg')}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('x-apple-health://');
                  } else {
                    GoogleFit.isAvailable((err, res) => {
                      if (err) {
                        return linkToGoogleFit();
                      } else {
                        res ? GoogleFit.openFit() : linkToGoogleFit();
                      }
                    });
                  }
                }}
                delay={1200}
              />
            </Layout>
          </Layout>
        )}
      </SafeAreaView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  hasViewedWelcome: profile.hasViewedWelcome,
});

export default connect(mapStateToProps)(Home);
