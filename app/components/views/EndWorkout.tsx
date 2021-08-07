import {Button, Input, Layout, Text} from '@ui-kitten/components';
import Slider from '@react-native-community/slider';
import React, {useMemo, useState} from 'react';
import GoogleFit from 'react-native-google-fit';
import AppleHealthKit, {
  HealthActivity,
  HealthObserver,
} from 'react-native-health';
import {Platform, View} from 'react-native';
import EndWorkoutProps from '../../types/views/EndWorkout';
import {useEffect} from 'react';
import moment from 'moment';
import {Alert} from 'react-native';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import {
  difficultyToMET,
  getCaloriesBurned,
  getDifficultyEmoji,
  getDifficultyText,
} from '../../helpers/exercises';

const EndWorkout: React.FC<EndWorkoutProps> = ({
  route,
  navigation,
  profile,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const {seconds} = route.params;
  console.log({seconds});
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
        if (Platform.OS === 'ios') {
          AppleHealthKit.getSamples(
            {
              startDate,
              endDate,
              type: AppleHealthKit.Constants.Observers.Workout,
            },
            (err, results) => {
              if (err) {
                return Alert.alert('Error', err);
              }
              const newCalories = results.reduce(
                // @ts-ignore
                (acc, cur) => acc + (cur.calories || 0),
                0,
              );
              const validCalories =
                newCalories > 0 ? newCalories : calorieEstimate;
              setCalories(validCalories);
              AppleHealthKit.saveWorkout(
                {
                  type: AppleHealthKit.Constants.Activities.MixedCardio,
                  startDate,
                  endDate,
                  // @ts-ignore
                  energyBurned: validCalories,
                  energyBurnedUnit: 'calorie',
                },
                (e: Error, res) => {
                  setLoading(false);
                  if (e) {
                    Alert.alert('Error saving workout', e.message);
                    console.log(e)
                    return;
                  }
                  console.log(res);
                  // workout successfully saved
                },
              );
            },
          );
        } else {
          const samples = await GoogleFit.getActivitySamples({
            startDate,
            endDate,
            bucketUnit: 'MINUTE',
          });
          const newCalories = samples.reduce(
            (acc, cur) => acc + (cur.calories || 0),
            0,
          );
          setCalories(newCalories > 0 ? newCalories : calorieEstimate);
          setLoading(false);
        }
      } catch (e) {
        Alert.alert('Error', e.message);
        setLoading(false);
      }
    };
    getSamples();
  }, [seconds, difficulty, profile.unit, profile.weight]);
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
    <Layout style={{flex: 1}}>
      <Text
        category="h5"
        style={{textAlign: 'center', margin: 10, marginTop: 20}}>
        Workout Complete!
      </Text>
      <Text style={{margin: 10}}>
        Rate your performance to help us understand your fitness level
      </Text>
      <Text style={{fontSize: 100, textAlign: 'center'}}>{emoji}</Text>

      <Slider
        style={{height: 40, flexDirection: 'row', margin: 10}}
        minimumValue={0}
        maximumValue={3}
        step={1}
        value={difficulty}
        onValueChange={setDifficulty}
      />
      <Text
        style={{
          fontWeight: 'bold',
          margin: 10,
          height: 50,
          textAlign: 'center',
        }}>
        {text}
        <Text style={{fontWeight: 'normal'}}>{` - ${subtext}`}</Text>
      </Text>
      <Input
        label="Workout note"
        textStyle={{minHeight: 50}}
        style={{margin: 10, marginTop: 0}}
        multiline
        placeholder="Add details about your workout"
      />
      <Button
        disabled={loading}
        style={{margin: 10}}
        onPress={() =>
          navigation.navigate('WorkoutSummary', {calories, seconds, difficulty})
        }>
        Save & Continue
      </Button>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(EndWorkout);
