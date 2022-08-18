import {Slider} from '@miblanchard/react-native-slider';
import React, {useMemo, useState} from 'react';
import {useEffect} from 'react';
import moment from 'moment';
import {Alert, ImageBackground, Platform, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {
  difficultyToMET,
  getCaloriesBurned,
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {saveWorkout} from '../../../helpers/biometrics';
import DevicePixels from '../../../helpers/DevicePixels';
import EndQuickRoutineProps from '../../../types/views/EndQuickRoutine';
import {saveQuickRoutine} from '../../../actions/quickRoutines';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';

const EndQuickRoutine: React.FC<EndQuickRoutineProps> = ({
  route,
  navigation,
  profile,
  workout,
  saveQuickRoutine: saveQuickRoutineAction,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const {seconds, routine} = route.params;
  useEffect(() => {
    const getSamples = async () => {
      const startDate = moment().subtract(seconds, 'seconds').toISOString();
      const endDate = moment().toISOString();
      const MET = difficultyToMET(difficulty);
      const calorieEstimate = getCaloriesBurned(
        seconds,
        MET,
        profile.weight,
        profile.unit,
      );
      setLoading(true);
      try {
        await saveWorkout(
          startDate,
          endDate,
          calorieEstimate,
          'CA Health workout',
          routine.name,
        );
        setCalories(calorieEstimate);
        setLoading(false);
      } catch (e) {
        Alert.alert(
          `Error saving workout to ${
            Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
          }`,
          e.message,
        );
        setLoading(false);
      }
    };
    getSamples();
  }, [
    seconds,
    difficulty,
    profile.unit,
    profile.weight,
    workout,
    routine.name,
  ]);
  const emoji = useMemo(() => getDifficultyEmoji(difficulty), [difficulty]);

  const {text, subtext} = useMemo(() => {
    const difficultyText = getDifficultyText(difficulty);
    if (difficulty === 0) {
      return {text: difficultyText, subtext: 'I could do this all day'};
    }
    if (difficulty === 1) {
      return {
        text: difficultyText,
        subtext: 'That was uncomfortable, but I can still talk easily',
      };
    }
    if (difficulty === 2) {
      return {
        text: difficultyText,
        subtext: "I can't breath or talk, my muscles burn",
      };
    }
    return {text: difficultyText, subtext: 'I might die'};
  }, [difficulty]);
  return (
    <ImageBackground
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Workout Complete!" />
        <LinearGradient
          colors={['#4795E3', '#1A1B1F']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.5}}
          style={{
            height: DevicePixels[154],
            width: DevicePixels[154],
            borderRadius: DevicePixels[78],
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LinearGradient
            colors={['#294195', '#121617']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.5}}
            style={{
              height: DevicePixels[150],
              width: DevicePixels[150],
              borderRadius: DevicePixels[75],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="check"
              color={colors.appWhite}
              size={DevicePixels[70]}
            />
          </LinearGradient>
        </LinearGradient>
        <Text
          style={{
            margin: DevicePixels[10],
            marginTop: DevicePixels[20],
            color: colors.appWhite,
          }}>
          Rate your performance to help us understand your fitness level
        </Text>

        <Slider
          minimumValue={0}
          maximumValue={3}
          step={1}
          value={difficulty}
          renderThumbComponent={() => {
            return (
              <View
                style={{
                  backgroundColor: colors.appWhite,
                  height: DevicePixels[30],
                  width: DevicePixels[30],
                  borderRadius: DevicePixels[15],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LinearGradient
                  colors={['#294195', '#121617']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.5}}
                  style={{
                    height: DevicePixels[26],
                    width: DevicePixels[26],
                    borderRadius: DevicePixels[13],
                  }}
                />
              </View>
            );
          }}
          minimumTrackTintColor={colors.appBlue}
          maximumTrackTintColor={colors.appWhite}
          containerStyle={{marginHorizontal: DevicePixels[20]}}
          onValueChange={val =>
            typeof val === 'object' && setDifficulty(val[0])
          }
        />

        <View
          style={{
            margin: DevicePixels[10],
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: DevicePixels[30],
              textAlign: 'center',
              margin: DevicePixels[10],
            }}>
            {emoji}
          </Text>
          <Text style={{color: colors.appWhite, fontWeight: 'bold', flex: 1}}>
            {text}
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'normal',
              }}>{` - ${subtext}`}</Text>
          </Text>
        </View>
        <Text style={{color: colors.appWhite, margin: DevicePixels[10]}}>
          Workout note
        </Text>
        <Input
          style={{minHeight: DevicePixels[50], margin: DevicePixels[10]}}
          multiline
          placeholder="Add details about this workout"
          value={note}
          onChangeText={setNote}
        />
        <Button
          text="Save & Continue"
          disabled={loading}
          style={{margin: DevicePixels[10]}}
          onPress={() => {
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
                  {style: 'cancel', text: 'Cancel'},
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
    </ImageBackground>
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
