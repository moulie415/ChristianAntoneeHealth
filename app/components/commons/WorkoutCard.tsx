import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../constants/colors';
import {getWorkoutDurationRounded} from '../../helpers/getWorkoutDurationRounded';
import {useAppSelector} from '../../hooks/redux';
import QuickRoutine, {Equipment} from '../../types/QuickRoutines';
import {Level, PlanWorkout} from '../../types/Shared';
import ImageAnimated from './ImageAnimated';
import Text from './Text';

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
  disabled?: boolean;
  plan?: boolean;
}> = ({item, onPress, disabled, plan}) => {
  const {profile} = useAppSelector(state => state.profile);

  const exercisesObj = useAppSelector(state => state.exercises.exercises);

  const exercises = useMemo(() => {
    if ('exerciseIds' in item) {
      return item.exerciseIds.map(id => {
        return typeof id === 'string'
          ? exercisesObj[id]
          : {...exercisesObj[id.id], ...id};
      });
    }
    if ('exercises' in item) {
      return item.exercises;
    }
    return [];
  }, [exercisesObj, item]);

  const duration = getWorkoutDurationRounded(exercises, profile.prepTime);

  const locked = 'premium' in item && item.premium && !profile.premium;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      key={'id' in item ? item.id : item.name}>
      <ImageAnimated
        style={{
          height: 120,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={
          'thumbnail' in item && item.thumbnail
            ? {uri: item.thumbnail.src}
            : require('../../images/upper_body.jpeg')
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
            bottom: -1,
            right: 0,
            left: 0,
          }}>
          {plan ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome6
                iconStyle="solid"
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
                {'level' in item && 'equipment' in item && (
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
                {!!duration && (
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
                      <Text style={{fontWeight: 'bold'}}>{duration}</Text>
                      {' mins'}
                    </Text>
                  </>
                )}
                {'exercises' in item && (
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
            <FontAwesome6
              iconStyle="solid"
              name="lock"
              color="#fff"
              size={20}
            />
          </View>
        )}
      </ImageAnimated>
    </TouchableOpacity>
  );
};

export default WorkoutCard;
