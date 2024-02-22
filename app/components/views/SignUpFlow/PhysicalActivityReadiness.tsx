import React, {ReactNode} from 'react';
import {ScrollView, View} from 'react-native';
import colors from '../../../constants/colors';
import Text from '../../commons/Text';

interface Question<T> {
  question: string | ReactNode;
  value: T;
  onChange: (x: boolean) => void;
}

const PhysicalActivityReadiness: React.FC<{
  heartCondition: boolean;
  setHeartCondition: (condition: boolean) => void;
  activityChestPain: boolean;
  setActivityChestPain: (chestPain: boolean) => void;
  chestPain: boolean;
  setChestPain: (chestPain: boolean) => void;
  loseBalanceConsciousness: boolean;
  setLoseBalanceConsciousness: (loseBalance: boolean) => void;
  boneProblems: boolean;
  setBoneProblems: (boneProblems: boolean) => void;
  drugPrescription: boolean;
  setDrugPrescription: (drugPrescription: boolean) => void;
  otherReason: boolean;
  setOtherReason: (reason: boolean) => void;
  willInformDoctor: boolean;
  setWillInformDoctor: (willInform: boolean) => void;
}> = ({
  heartCondition,
  setHeartCondition,
  activityChestPain,
  setActivityChestPain,
  chestPain,
  setChestPain,
  loseBalanceConsciousness,
  setLoseBalanceConsciousness,
  boneProblems,
  setBoneProblems,
  drugPrescription,
  setDrugPrescription,
  otherReason,
  setOtherReason,
  willInformDoctor,
  setWillInformDoctor,
}) => {
  const questions: Question<any>[] = [
    {
      question:
        'Has your doctor ever said that you have a heart condition and that your should only do physical activity recommended by a doctor?',
      value: heartCondition,
      onChange: setHeartCondition,
    },
    {
      question:
        'Do your feel pain in your chest when you do physical activity?',
      value: activityChestPain,
      onChange: setActivityChestPain,
    },
    {
      question:
        'In the past month, have you had chest pain when you were not doing physical activity?',
      value: chestPain,
      onChange: setChestPain,
    },
    {
      question:
        'Do you lose your balance because of dizziness or do you ever lose consciousness?',
      value: loseBalanceConsciousness,
      onChange: setLoseBalanceConsciousness,
    },
    {
      question:
        'Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?',
      value: boneProblems,
      onChange: setBoneProblems,
    },
    {
      question:
        'Is your doctor currently prescribing drugs for your blood pressure or heart condition?',
      value: drugPrescription,
      onChange: setDrugPrescription,
    },
    {
      question:
        'Do you know of any other reason why you should not do physical activity?',
      value: otherReason,
      onChange: setOtherReason,
    },

    {
      question: (
        <Text>
          If you answered <Text style={{fontWeight: 'bold'}}>YES</Text> to any
          of the above questions, will you inform your doctor that you intend to
          increase your physical activity levels?
        </Text>
      ),
      value: willInformDoctor,
      onChange: setWillInformDoctor,
    },
  ];
  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 100}}
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}>
      <Text
        style={{
          marginTop: 20,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}>
        Physical activity readiness questionnaire
      </Text>
      {questions.map(({question}) => {
        return (
          <View key={question}>
            <Text
              style={{
                marginVertical: 20,
                fontSize: 16,
                color: colors.appWhite,
              }}>
              {question}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default PhysicalActivityReadiness;
