import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';
import React from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../App';
import colors from '../../constants/colors';
import { setWorkout } from '../../reducers/exercises';
import Exercise from '../../types/Exercise';
import QuickRoutine from '../../types/QuickRoutines';
import { SavedQuickRoutine, SavedWorkout } from '../../types/SavedItem';
import { Profile } from '../../types/Shared';
import Text from './Text';

const SavedWorkoutCard: React.FC<{
  item: SavedWorkout | SavedQuickRoutine;
  quickRoutines: { [key: string]: QuickRoutine };
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'SavedItems'>;
  exercises: { [key: string]: Exercise };
  setWorkoutAction: (workout: Exercise[]) => void;
}> = ({
  item,
  quickRoutines,
  profile,
  navigation,
  exercises,

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
        if ('planWorkout' in item && item.planWorkout) {
          setWorkoutAction(
            item.workout.map(id => {
              return exercises[id];
            }),
          );

          navigation.navigate('WorkoutSummary', {
            savedWorkout: item,
            saved: true,
          });
        } else if (quickRoutine) {
          navigation.navigate('QuickRoutineSummary', {
            savedQuickRoutine: item,
            routine: quickRoutine,
            saved: true,
          });
        }
      }}
      key={item.id}
    >
      <ImageBackground
        style={{
          height: 120,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
          overflow: 'hidden',
        }}
        source={
          quickRoutine
            ? { uri: quickRoutine.thumbnail?.src }
            : require('../../images/upper_body.jpeg')
        }
      >
        <View
          style={{
            height: 120,
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 18,
            }}
          >
            {`${moment(item.createdate).format('MMMM Do YYYY')}`}
          </Text>
          <View
            style={{
              marginBottom: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ marginRight: 10, marginVertical: 5 }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 14,
                }}
              >
                Duration
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 14,
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {moment()
                    .utc()
                    .startOf('day')
                    .add({ seconds: item.seconds })
                    .format('mm:ss')}
                </Text>
              </Text>
            </View>
            {!!item.calories && (
              <View style={{ marginRight: 10 }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 14,
                  }}
                >
                  Calories
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 14,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>
                    {Math.round(item.calories)}
                  </Text>
                </Text>
              </View>
            )}
            {!!item.averageHeartRate && (
              <View>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 14,
                  }}
                >
                  Avg Heart Rate
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 14,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>
                    {Math.round(item.averageHeartRate)}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              width: 220,
            }}
          >
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5,
              }}
            >
              {quickRoutine && 'exerciseIds' in quickRoutine
                ? quickRoutine.name
                : 'planWorkout' in item
                  ? item.planWorkout?.name
                  : ''}
            </Text>
            {/* {quickRoutine && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                {`${getLevelString(quickRoutine.level)} - ${getEquipmentString(
                  quickRoutine.equipment,
                )}`}
              </Text>
            )} */}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({ quickRoutines, profile, exercises }: RootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
  profile: profile.profile,
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedWorkoutCard);
