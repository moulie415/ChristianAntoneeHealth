import React, {useState} from 'react';
import {Button, Text} from '@ui-kitten/components';
import {View, Image, TouchableOpacity} from 'react-native';
import styles from '../../styles/views/Home';
import HomeProps from '../../types/views/Home';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import HomeWelcome from './HomeWelcome';
import colors from '../../constants/colors';
import globalStyles from '../../styles/globalStyles';

const Home: React.FC<HomeProps> = ({
  navigation,
  profile,
  hasViewedWelcome,
}) => {
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text
        category="h3"
        style={{
          textAlign: 'center',
          padding: 20,
        }}>{`Welcome ${profile.name || 'user'}!`}</Text>
      {!hasViewedWelcome && <HomeWelcome />}
      {hasViewedWelcome && (
        <View style={{flex: 1}}>
          <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
            <Image
              style={{width: '100%', flex: 1}}
              resizeMode="cover"
              source={require('../../images/old_man_yoga.jpeg')}
            />
            <View style={{position: 'absolute', bottom: 0, margin: 5}}>
              <Text category="h5" style={globalStyles.textShadow}>
                Recommended exercises
              </Text>
              <Text category="s1" style={globalStyles.textShadow}>
                Based on your most recent workout
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
            <Image
              style={{width: '100%', flex: 1}}
              resizeMode="cover"
              source={require('../../images/yoga_mat.jpeg')}
            />
            <View style={{position: 'absolute', bottom: 0, margin: 5}}>
              <Text category="h5" style={globalStyles.textShadow}>
                No gym required
              </Text>
              <Text category="s1" style={globalStyles.textShadow}>
                Equipment free workouts
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
            <Image
              style={{width: '100%', flex: 1}}
              resizeMode="cover"
              source={require('../../images/old_man_machine.jpeg')}
            />
            <View
              style={{position: 'absolute', bottom: 0, right: 0, margin: 5}}>
              <Text category="h5" style={globalStyles.textShadow}>
                Track your fitness
              </Text>
              <Text
                category="s1"
                style={{backgroundColor: colors.appBlue, padding: 5}}>
                Last fitness test 4 weeks ago
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  hasViewedWelcome: profile.hasViewedWelcome,
});

export default connect(mapStateToProps)(Home);
