import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {
  CurrentExercise,
  DietaryPreference,
  Sleep,
  StressLevel,
} from '../../../types/Profile';
import SelectableButton from '../../commons/SelectableButton';

const stressLevels: StressLevel[] = ['low', 'medium', 'high'];

interface Question<T> {
  question: string;
  onPress: (x: any) => void;
  buttons: {text: string; value: T}[];
  value: T;
}

const HealthAndLifestyle: React.FC<{
  stressLevel: StressLevel;
  setStressLevel: (level: StressLevel) => void;
  sleep: Sleep;
  setSleep: (sleep: Sleep) => void;
  dietaryPreference: DietaryPreference | string;
  setDietaryPreference: (preference: DietaryPreference | string) => void;
  currentExercise: CurrentExercise;
  setCurrentExercise: (currentExercise: CurrentExercise) => void;
  fitnessRating: number | null;
  setFitnessRating: (rating: number | null) => void;
}> = ({
  stressLevel,
  setStressLevel,
  setSleep,
  sleep,
  dietaryPreference,
  setDietaryPreference,
  currentExercise,
  setCurrentExercise,
  fitnessRating,
  setFitnessRating,
}) => {
  const stressQuestion: Question<StressLevel> = {
    question: 'How would you describe your current stress levels?',
    onPress: setStressLevel,
    buttons: [
      {value: 'low', text: 'Low'},
      {value: 'medium', text: 'Moderate'},
      {value: 'high', text: 'High'},
    ],
    value: stressLevel,
  };

  const sleepQuestion: Question<Sleep> = {
    question: 'How many hours of sleep do you get each night?',
    onPress: setSleep,
    buttons: [
      {value: Sleep.LESS_THAN_FOUR, text: 'Less than 4'},
      {value: Sleep.BETWEEN_FOUR_AND_SEVEN, text: 'Between 4-7'},
      {value: Sleep.MORE_THAN_SEVEN, text: 'More than 7'},
    ],
    value: sleep,
  };

  const dietaryQuestion: Question<DietaryPreference | string> = {
    question: 'How would you describe your dietary preferences?',
    onPress: setDietaryPreference,
    buttons: [
      {value: DietaryPreference.VEGETARIAN, text: 'Vegetarian'},
      {value: DietaryPreference.VEGAN, text: 'Vegan'},
      {
        value: DietaryPreference.INTERMITTENT_FASTING,
        text: 'Intermittent Fasting',
      },
      {value: DietaryPreference.KETOGENIC, text: 'Ketogenic'},
      {value: DietaryPreference.PALEO, text: 'Paleo'},
      {
        value: DietaryPreference.GLUTEN_FREE,
        text: 'Gluten Free',
      },
    ],
    value: dietaryPreference,
  };

  const exerciseQuestion: Question<CurrentExercise> = {
    question: 'How many hours of sleep do you get each night?',
    onPress: setCurrentExercise,
    buttons: [
      {value: CurrentExercise.THREE_FOUR_WEEK, text: '3-4x per week'},
      {value: CurrentExercise.ONE_TWO_WEEK, text: '1-2x per week'},
      {value: CurrentExercise.ONE_TWO_MONTH, text: '1-2x per month'},
      {value: CurrentExercise.NOT_AT_ALL, text: 'Not at all'},
    ],
    value: currentExercise,
  };
  const questions = [
    stressQuestion,
    sleepQuestion,
    dietaryQuestion,
    exerciseQuestion,
  ];

  console.log(questions);
  return (
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
      }}>
      {questions.map(({question, buttons, onPress, value}) => {
        return (
          <View key={question}>
            <Text
              style={{
                marginBottom: 20,
                fontSize: 24,
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              {question}
            </Text>
            {buttons.map(({value: val, text}) => {
              return (
                <SelectableButton
                  key={val}
                  text={text}
                  // secondaryText=""
                  selected={val === value}
                  onPress={() => onPress(val)}
                  style={{marginBottom: 15}}
                />
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default HealthAndLifestyle;
