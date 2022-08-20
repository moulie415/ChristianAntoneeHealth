import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {SavedQuickRoutine, SavedWorkout} from '../../types/SavedItem';
import FastImage from 'react-native-fast-image';
import DevicePixels from '../../helpers/DevicePixels';
import {
  getEquipmentString,
  getFocusString,
  getImage,
  getLevelString,
} from './WorkoutCard';
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
          navigation.navigate('StartWorkout', {name: item.name});
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
          height: DevicePixels[120],
          marginHorizontal: DevicePixels[10],
          marginBottom: DevicePixels[10],
          borderRadius: DevicePixels[10],
        }}
        source={getImage(
          quickRoutine ? quickRoutine.level : profile.experience,
        )}>
        <FastImage
          source={require('../../images/BlackTransparentBackground.png')}
          blurRadius={3}
          style={{
            height: DevicePixels[120],
            justifyContent: 'center',
            padding: DevicePixels[10],
            borderRadius: DevicePixels[10],
          }}>
          <View
            style={{
              marginBottom: DevicePixels[5],
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[12],
                }}>
                Duration
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[12],
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
                  fontSize: DevicePixels[30],
                  marginHorizontal: DevicePixels[5],
                }}>
                {getDifficultyEmoji(item.difficulty)}
              </Text>
            )}
          </View>

          <View
            style={{
              width: DevicePixels[220],
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
                marginBottom: DevicePixels[5],
              }}>
              {'name' in item ? item.name : quickRoutine.name}
            </Text>
            {quickRoutine && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[12],
                }}>
                {`${getLevelString(quickRoutine.level)} - ${getEquipmentString(
                  quickRoutine.equipment,
                )} - ${getFocusString(quickRoutine.focus)}`}
              </Text>
            )}
          </View>
        </FastImage>
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
