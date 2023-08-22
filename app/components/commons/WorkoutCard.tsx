import {View, TouchableOpacity, ImageBackground} from 'react-native';
import React from 'react';
import QuickRoutine, {Equipment} from '../../types/QuickRoutines';

import {Goal, Level, MyRootState, PlanWorkout} from '../../types/Shared';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from './Text';
import Profile from '../../types/Profile';
import FastImage from 'react-native-fast-image';
import FastImageAnimated from './FastImageAnimated';
import LinearGradient from 'react-native-linear-gradient';

export const getImage = (level?: Level) => {
  if (level === Level.INTERMEDIATE) {
    return require('../../images/intermediate.jpg');
  }
  if (level === Level.ADVANCED) {
    return require('../../images/advanced.jpg');
  }
  return require('../../images/beginner.jpg');
};

export const getEquipmentString = (equipment: Equipment) => {
  if (equipment === 'full') {
    return 'Full Equipment';
  }
  if (equipment === 'minimal') {
    return 'Minimal Equipment';
  }
  return 'No Equipment';
};

export const getLevelString = (level: Level) => {
  if (level === 'beginner') {
    return 'Beginner';
  }
  if (level === 'intermediate') {
    return 'Intermediate';
  }
  return 'Advanced';
};

const WorkoutCard: React.FC<{
  item: QuickRoutine | PlanWorkout;
  onPress: () => void;
  profile: Profile;
  disabled?: boolean;
  plan?: boolean;
}> = ({item, onPress, profile, disabled, plan}) => {
  const locked = 'premium' in item && item.premium && !profile.premium;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      key={'id' in item ? item.id : item.name}>
      <FastImageAnimated
        style={{
          height: 120,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={
          'thumbnail' in item && item.thumbnail
            ? {uri: item.thumbnail.src}
            : getImage('level' in item ? item.level : Level.ADVANCED)
        }>
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            height: 100,
            justifyContent: 'flex-end',
            padding: 10,
            borderRadius: 10,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
          }}>
          {plan ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="dumbbell"
                color={colors.appWhite}
                size={30}
                style={{marginHorizontal: 10}}
              />
              <View>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 25,
                    fontWeight: 'bold',
                  }}>
                  Workout
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    marginTop: 5,
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{}}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 5,
                  }}>
                  {item.name}
                </Text>
                {'level' in item && (
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontSize: 14,
                    }}>
                    {`${getLevelString(item.level)} - ${getEquipmentString(
                      item.equipment,
                    )}`}
                  </Text>
                )}
              </View>
              <View style={{justifyContent: 'flex-end'}}>
                {'duration' in item ? (
                  <>
                    <Text
                      style={{
                        color: colors.appWhite,
                        fontSize: 12,
                        textAlign: 'center',
                      }}>
                      Under
                    </Text>
                    <Text
                      style={{
                        color: colors.appWhite,
                        fontSize: 12,
                      }}>
                      <Text style={{fontWeight: 'bold'}}>{item.duration}</Text>
                      {' mins'}
                    </Text>
                  </>
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                      {item.exercises.length + ' '}
                    </Text>
                    <Text style={{color: colors.appWhite}}>
                      {item.exercises.length > 1 ? 'exercises' : 'exercise'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </LinearGradient>

        {locked && (
          <View style={{position: 'absolute', top: 15, right: 15}}>
            <Icon name="lock" color="#fff" size={20} />
          </View>
        )}
      </FastImageAnimated>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(WorkoutCard);
