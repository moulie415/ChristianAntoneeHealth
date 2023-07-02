import React, {useMemo, useState, useEffect} from 'react';
import EndWorkoutProps from '../../../types/views/EndWorkout';
import {Alert, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {saveWorkout as saveWorkoutAction} from '../../../actions/exercises';
import {saveWorkout} from '../../../helpers/biometrics';
import Button from '../../commons/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import colors from '../../../constants/colors';
import RPESlider from '../../commons/RPESlider';
import useThrottle from '../../../hooks/UseThrottle';
import useWorkoutData from '../../../hooks/UseWorkoutData';

const EndWorkout: React.FC<EndWorkoutProps> = ({
  route,
  navigation,
  profile,
  workout,
  saveWorkoutAction: saveAction,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const {seconds, planWorkout} = route.params;

  const {
    loading: isLoading,
    averageHeartRate,
    heartRateSamples,
    calories,
  } = useWorkoutData(seconds, profile, difficulty, new Date());

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
    });
  }, 3000);

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Workout Complete!" />

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
    </View>
  );
};

const mapDispatchToProps = {
  saveWorkoutAction,
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

export default connect(mapStateToProps, mapDispatchToProps)(EndWorkout);
