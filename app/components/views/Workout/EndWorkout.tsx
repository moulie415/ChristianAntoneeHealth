import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {FONTS_SIZES} from '../../../constants';
import colors from '../../../constants/colors';
import {saveWorkout} from '../../../helpers/biometrics';
import {logError} from '../../../helpers/error';
import {getWorkoutData} from '../../../helpers/getWorkoutData';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import {saveWorkout as saveWorkoutAction} from '../../../reducers/exercises';
import Exercise from '../../../types/Exercise';
import {SavedWorkout} from '../../../types/SavedItem';
import {Profile} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
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

  useBackHandler(() => true);

  const handleSave = async (saved: boolean) => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);

      const {
        calories,
        averageHeartRate,
        heartRateSamples,
        calorieCalculationType,
        calorieSamples,
      } = await getWorkoutData(
        seconds,
        profile,
        difficulty,
        startTime,
        endTime,
      );
      await saveWorkout(
        seconds,
        'CA Health workout',
        workout.map(e => e.name).join(', '),
        calories || 0,
      );
      const savedWorkout = {
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
      };
      saveAction(savedWorkout);
      navigation.navigate('WorkoutSummary', {
        savedWorkout,
      });
    } catch (e) {
      Snackbar.show({text: 'Error fetching workout data'});
      logError(e);
      setLoading(false);
    }
  };

  const saveAndContinue = async () => {
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
              handleSave(false);
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              handleSave(true);
            },
          },
        ],
      );
    } else {
      handleSave(false);
    }
  };

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
          onPress={saveAndContinue}
        />
      </SafeAreaView>
      <AbsoluteSpinner loading={loading} text="Fetching workout data..." />
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
