import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {Linking, Platform, SafeAreaView} from 'react-native';
import GoogleFit from 'react-native-google-fit';
import HomeProps from '../../types/views/Home';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import HomeWelcome from './HomeWelcome';
import HomeCard from '../commons/HomeCard';
import {linkToGoogleFit} from '../../helpers/biometrics';
import DevicePixels from '../../helpers/DevicePixels';

const Home: React.FC<HomeProps> = ({navigation, profile, hasViewedWelcome}) => {
  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Text
          category="h3"
          style={{
            textAlign: 'center',
            padding: DevicePixels[20],
            marginVertical: DevicePixels[10]
          }}>{`Welcome ${profile.name || 'user'}!`}</Text>
        {!hasViewedWelcome && <HomeWelcome />}
        {hasViewedWelcome && (
          <Layout style={{flex: 1}}>
            <Layout
              style={{
                flex: 1,
                flexDirection: 'row',
                marginBottom: DevicePixels[20],
              }}>
              <HomeCard
                title="New Workout"
                subtitle="Start a new workout now"
                image={require('../../images/old_man_stretching.jpeg')}
                onPress={() => navigation.navigate('Workout')}
              />
              <HomeCard
                title="Fitness tests"
                subtitle="Track your fitness overtime"
                image={require('../../images/flexibility.jpeg')}
                onPress={() => navigation.navigate('Fitness')}
              />
            </Layout>
            <Layout
              style={{
                flex: 1,
                flexDirection: 'row',
                marginBottom: DevicePixels[20],
              }}>
              <HomeCard
                title="Education"
                subtitle="Health and nutrition articles"
                image={require('../../images/education.jpeg')}
                onPress={() => navigation.navigate('Education')}
              />
              <HomeCard
                title="Saved routines"
                subtitle="Start a saved workout"
                image={require('../../images/yoga_mat.jpeg')}
                onPress={() => 0}
              />
            </Layout>
            <Layout
              style={{
                flex: 1,
                flexDirection: 'row',
                marginBottom: DevicePixels[20],
              }}>
              <HomeCard
                title="Quick routines"
                subtitle="View premade routines"
                image={require('../../images/dumbell.png')}
                onPress={() => navigation.navigate('QuickRoutines')}
              />
              <HomeCard
                title="View Activity"
                subtitle="Track you daily activity"
                image={require('../../images/activity_log.jpeg')}
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
