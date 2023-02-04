import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {SavedQuickRoutine, SavedWorkout} from '../../types/SavedItem';
import FastImage from 'react-native-fast-image';

import {getEquipmentString, getImage, getLevelString} from './WorkoutCard';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutine from '../../types/QuickRoutines';
import Profile from '../../types/Profile';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import moment from 'moment';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {getDifficultyEmoji} from '../../helpers/exercises';
import Exercise from '../../types/Exercise';
import {getExercisesById, setWorkout} from '../../actions/exercises';
import Text from './Text';

const SavedWorkoutCard: React.FC<{
  item: SavedWorkout | SavedQuickRoutine;
  quickRoutines: {[key: string]: QuickRoutine};
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'SavedItems'>;
  exercises: {[key: string]: Exercise};
  setWorkoutAction: (workout: Exercise[]) => void;
  getExercisesByIdAction: (ids: string[]) => void;
}> = ({
  item,
  quickRoutines,
  profile,
  navigation,
  exercises,
  getExercisesByIdAction,
  setWorkoutAction,
}) => {
  const quickRoutine =
    'quickRoutineId' in item && quickRoutines[item.quickRoutineId];
  if ('quickRoutineId' in item && !quickRoutine) {
    return null;
  }
  const locked = quickRoutine && quickRoutine.premium && !profile.premium;
  return (
    <TouchableOpacity
      onPress={() => {
        if ('workout' in item) {
          setWorkoutAction(
            item.workout.map(id => {
              return exercises[id];
            }),
          );
          navigation.navigate('PreWorkout', {name: item.name});
        } else if (quickRoutine) {
          getExercisesByIdAction(quickRoutine.exerciseIds);
          navigation.navigate('QuickRoutine', {
            routine: quickRoutine,
          });
        }
      }}
      key={item.id}>
      <FastImage
        style={{
          height: 140,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={
          quickRoutine
            ? {uri: quickRoutine.thumbnail?.src}
            : getImage(profile.experience)
        }>
        <View
          style={{
            height: 140,
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
            }}>
            {`${moment(item.createdate).format('MMMM Do YYYY')}`}
          </Text>
          <View
            style={{
              marginBottom: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                Duration
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {moment()
                    .utc()
                    .startOf('day')
                    .add({seconds: item.seconds})
                    .format('mm:ss')}
                </Text>
              </Text>
            </View>
            {'difficulty' in item && (
              <Text
                style={{
                  fontSize: 30,
                  marginHorizontal: 5,
                }}>
                {getDifficultyEmoji(item.difficulty)}
              </Text>
            )}
          </View>

          <View
            style={{
              width: 220,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              {quickRoutine && 'exerciseIds' in quickRoutine
                ? quickRoutine.name
                : 'name' in item
                ? item.name
                : ''}
            </Text>
            {quickRoutine && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                {`${getLevelString(quickRoutine.level)} - ${getEquipmentString(
                  quickRoutine.equipment,
                )}`}
              </Text>
            )}
          </View>
        </View>
      </FastImage>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({quickRoutines, profile, exercises}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
  profile: profile.profile,
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
  getExercisesByIdAction: getExercisesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedWorkoutCard);
