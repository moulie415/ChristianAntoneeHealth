import React, {useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {saveWorkout} from '../../../helpers/biometrics';
import DevicePixels from '../../../helpers/DevicePixels';
import EndQuickRoutineProps from '../../../types/views/EndQuickRoutine';
import {saveQuickRoutine} from '../../../actions/quickRoutines';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import RPESlider from '../../commons/RPESlider';
import {getCaloriesBurned} from '../../../helpers/exercises';

const EndQuickRoutine: React.FC<EndQuickRoutineProps> = ({
  route,
  navigation,
  profile,
  workout,
  saveQuickRoutine: saveQuickRoutineAction,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const {seconds, routine} = route.params;

  const calories = getCaloriesBurned(
    seconds,
    difficulty,
    profile.weight,
    profile.unit,
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Workout Complete!" />
        <View style={{flex: 1, marginTop: DevicePixels[40]}}>
          <RPESlider setRpe={setDifficulty} rpe={difficulty} />
          {/* <Text style={{color: colors.appWhite, margin: DevicePixels[10]}}>
          Workout note
        </Text>
        <Input
          style={{minHeight: DevicePixels[50], margin: DevicePixels[10]}}
          multiline
          placeholder="Add details about this workout"
          value={note}
          onChangeText={setNote}
        /> */}
          <Button
            text="Save & Continue"
            disabled={loading}
            style={{margin: DevicePixels[10]}}
            onPress={async () => {
              setLoading(true);
              await saveWorkout(
                seconds,
                difficulty,
                profile,
                'CA Health workout',
                routine.name,
              );
              const navigate = () => {
                navigation.navigate('QuickRoutineSummary', {
                  calories,
                  seconds,
                  difficulty,
                  routine,
                });
              };

              const save = (saved: boolean) => {
                saveQuickRoutineAction({
                  calories,
                  seconds,
                  difficulty,
                  createdate: new Date(),
                  quickRoutineId: routine.id,
                  saved,
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
        </View>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveQuickRoutine,
};

export default connect(mapStateToProps, mapDispatchToProps)(EndQuickRoutine);
