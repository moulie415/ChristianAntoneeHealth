import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../../App';
import { FONTS_SIZES } from '../../../constants';
import colors from '../../../constants/colors';
import { saveWorkout } from '../../../helpers/biometrics';
import { logError } from '../../../helpers/error';
import { getWorkoutData } from '../../../helpers/getWorkoutData';
import { useBackHandler } from '../../../hooks/UseBackHandler';
import useThrottle from '../../../hooks/UseThrottle';
import { saveQuickRoutine } from '../../../reducers/quickRoutines';
import Exercise from '../../../types/Exercise';
import { SavedQuickRoutine } from '../../../types/SavedItem';
import { Profile } from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Button from '../../commons/Button';
import RPESlider from '../../commons/RPESlider';
import Text from '../../commons/Text';

const EndQuickRoutine: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'EndQuickRoutine'>;
  route: RouteProp<StackParamList, 'EndQuickRoutine'>;
  profile: Profile;
  workout: Exercise[];
  saveQuickRoutine: (payload: SavedQuickRoutine) => void;
}> = ({
  route,
  navigation,
  profile,
  workout,
  saveQuickRoutine: saveQuickRoutineAction,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    seconds,
    routine,
    endTime,
    exerciseEvents,
    startTime,
    pauseEvents,
    watchWorkoutData,
  } = route.params;

  useBackHandler(() => true);

  const handleSave = useThrottle(async (saved: boolean) => {
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
        watchWorkoutData,
      );

      await saveWorkout(
        seconds,
        'CA Health workout',
        routine.name,
        calories || 0,
      );

      const savedQuickRoutine = {
        calories: calories || 0,
        seconds,
        difficulty,
        createdate: new Date(),
        quickRoutineId: routine.id,
        saved,
        averageHeartRate,
        heartRateSamples,
        exerciseEvents,
        pauseEvents,
        startTime,
        endTime,
        calorieSamples,
        calorieCalculationType,
      };
      saveQuickRoutineAction(savedQuickRoutine);
      navigation.navigate('QuickRoutineSummary', {
        savedQuickRoutine,
        routine,
      });
    } catch (e) {
      logError(e);
      Snackbar.show({ text: 'Error fetching workout data' });
    }
    setLoading(false);
  }, 3000);

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
    <ScrollView style={{ flex: 1, backgroundColor: colors.appGrey }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: FONTS_SIZES.LARGE,
            marginBottom: 10,
            marginTop: 20,
            fontWeight: 'bold',
          }}
        >
          Workout complete!
        </Text>
        <RPESlider setRpe={setDifficulty} rpe={difficulty} />

        <Button
          text="Save & Continue"
          disabled={loading}
          loading={loading}
          style={{ marginHorizontal: 20, marginBottom: 20 }}
          onPress={saveAndContinue}
        />
      </SafeAreaView>
      <AbsoluteSpinner loading={loading} text="Fetching workout data..." />
    </ScrollView>
  );
};

const mapStateToProps = ({ profile, exercises }: RootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveQuickRoutine,
};

export default connect(mapStateToProps, mapDispatchToProps)(EndQuickRoutine);
