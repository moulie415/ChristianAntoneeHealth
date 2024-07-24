import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {FONTS_SIZES} from '../../../constants';
import colors from '../../../constants/colors';
import {saveWorkout} from '../../../helpers/biometrics';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import useThrottle from '../../../hooks/UseThrottle';
import useWorkoutData from '../../../hooks/UseWorkoutData';
import {saveWorkout as saveWorkoutAction} from '../../../reducers/exercises';
import Exercise from '../../../types/Exercise';
import {SavedWorkout} from '../../../types/SavedItem';
import {Profile} from '../../../types/Shared';
import Button from '../../commons/Button';
import RPESlider from '../../commons/RPESlider';
import Text from '../../commons/Text';

const EndWorkout: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'EndWorkout'>;
  route: RouteProp<StackParamList, 'EndWorkout'>;
  profile: Profile;
  workout: Exercise[];
  saveWorkoutAction: (workout: SavedWorkout) => void;
}> = ({route, navigation, profile, workout, saveWorkoutAction: saveAction}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const {
    seconds,
    planWorkout,
    endTime,
    exerciseEvents,
    pauseEvents,
    startTime,
    planId,
  } = route.params;

  const {
    loading: isLoading,
    averageHeartRate,
    heartRateSamples,
    calories,
    calorieSamples,
    calorieCalculationType,
  } = useWorkoutData(seconds, profile, difficulty, startTime, endTime);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const save = useThrottle((saved: boolean) => {
    saveAction({
      calories: calories || 0,
      seconds,
      difficulty,
      createdate: new Date(),
      workout: workout.map(e => e.id || ''),
      saved,
      planWorkout,
      averageHeartRate,
      heartRateSamples,
      exerciseEvents,
      pauseEvents,
      startTime,
      endTime,
      calorieSamples,
      planId: planId || '',
      calorieCalculationType,
    });
  }, 3000);

  useBackHandler(() => true);

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: FONTS_SIZES.LARGE,
            marginBottom: 10,
            marginTop: 20,
            fontWeight: 'bold',
          }}>
          Workout complete!
        </Text>
        <RPESlider rpe={difficulty} setRpe={setDifficulty} />
        {/* <Text style={{color: colors.appWhite, margin: 10}}>
          Workout note
        </Text>
        <Input
          style={{minHeight: 50, margin: 10}}
          multiline
          placeholder="Add details about this workout"
          value={note}
          onChangeText={setNote}
        /> */}
        <Button
          text="Save & Continue"
          disabled={loading}
          style={{margin: 10}}
          onPress={async () => {
            setLoading(true);
            await saveWorkout(
              seconds,
              'CA Health workout',
              workout.map(e => e.name).join(', '),
              calories || 0,
            );
            const navigate = () => {
              navigation.navigate('WorkoutSummary', {
                calories,
                seconds,
                difficulty,
                averageHeartRate,
              });
            };

            if (profile.premium) {
              Alert.alert(
                'Save workout',
                'Do you wish to save this workout to view later?',
                [
                  {
                    style: 'cancel',
                    text: 'Cancel',
                    onPress: () => setLoading(false),
                  },
                  {
                    text: 'No',
                    onPress: () => {
                      save(false);
                      navigate();
                    },
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      save(true);
                      navigate();
                    },
                  },
                ],
              );
            } else {
              save(false);
              navigate();
            }
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const mapDispatchToProps = {
  saveWorkoutAction,
};

const mapStateToProps = ({profile, exercises}: RootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

export default connect(mapStateToProps, mapDispatchToProps)(EndWorkout);
