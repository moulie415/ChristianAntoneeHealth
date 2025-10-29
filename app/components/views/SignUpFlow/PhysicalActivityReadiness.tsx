import React, { Fragment, ReactNode, useEffect } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import colors from '../../../constants/colors';
import Checkbox from '../../commons/Checkbox';
import Divider from '../../commons/Divider';
import Input from '../../commons/Input';
import Text from '../../commons/Text';
import Toggle from '../../commons/Toggle';

interface Question<T> {
  question: string | ReactNode;
  value: T;
  onChange: (x: boolean) => void;
  key: string;
  description?: string;
  setDescription?: (description: string) => void;
  descriptionPlaceholder?: string;
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
  boneProblemsDescription: string;
  setBoneProblemsDescription: (string: string) => void;
  drugPrescription: boolean;
  setDrugPrescription: (drugPrescription: boolean) => void;
  otherReason: boolean;
  setOtherReason: (reason: boolean) => void;
  otherReasonDescription: string;
  setOtherReasonDescription: (description: string) => void;
  confirmQuestionnaire: boolean;
  setConfirmQuestionnaire: (confirm: boolean) => void;
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
  boneProblemsDescription,
  setBoneProblemsDescription,
  drugPrescription,
  setDrugPrescription,
  otherReason,
  setOtherReason,
  otherReasonDescription,
  setOtherReasonDescription,
  confirmQuestionnaire,
  setConfirmQuestionnaire,
}) => {
  useEffect(() => {
    if (!otherReason) {
      setOtherReasonDescription('');
    }
    if (!boneProblems) {
      setBoneProblemsDescription('');
    }
  }, [
    otherReason,
    setOtherReasonDescription,
    boneProblems,
    setBoneProblemsDescription,
  ]);
  const questions: Question<any>[] = [
    {
      key: 'heartCondition',
      question:
        'Has your doctor ever said that you have a heart condition and that your should only do physical activity recommended by a doctor?',
      value: heartCondition,
      onChange: setHeartCondition,
    },
    {
      key: 'activityChestPain',
      question:
        'Do your feel pain in your chest when you do physical activity?',
      value: activityChestPain,
      onChange: setActivityChestPain,
    },
    {
      key: 'chestPain',
      question:
        'In the past month, have you had chest pain when you were not doing physical activity?',
      value: chestPain,
      onChange: setChestPain,
    },
    {
      key: 'loseBalanceConsciousness',
      question:
        'Do you lose your balance because of dizziness or do you ever lose consciousness?',
      value: loseBalanceConsciousness,
      onChange: setLoseBalanceConsciousness,
    },
    {
      key: 'boneProblems',
      question:
        'Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?',
      value: boneProblems,
      onChange: setBoneProblems,
      description: boneProblemsDescription,
      setDescription: setBoneProblemsDescription,
      descriptionPlaceholder: 'Please enter details here...',
    },
    {
      key: 'drugPrescription',
      question:
        'Is your doctor currently prescribing drugs for your blood pressure or heart condition?',
      value: drugPrescription,
      onChange: setDrugPrescription,
    },
    {
      key: 'otherReason',
      question:
        'Do you know of any other reason why you should not do physical activity?',
      value: otherReason,
      onChange: setOtherReason,
      description: otherReasonDescription,
      setDescription: setOtherReasonDescription,
      descriptionPlaceholder: 'Please enter reason here...',
    },
  ];
  return (
    <KeyboardAwareScrollView
      extraScrollHeight={Platform.OS === 'ios' ? 50 : 75}
      contentContainerStyle={{ paddingBottom: 100 }}
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          margin: 20,
          marginBottom: 10,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}
      >
        Physical activity readiness questionnaire
      </Text>
      {questions.map(
        ({
          question,
          key,
          value,
          onChange,
          description,
          setDescription,
          descriptionPlaceholder,
        }) => {
          return (
            <Fragment key={key}>
              <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.appWhite,
                    lineHeight: 20,
                    flex: 1,
                  }}
                >
                  {question}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: colors.appWhite, fontWeight: 'bold' }}>
                    No
                  </Text>
                  <Toggle
                    onValueChange={onChange}
                    value={value}
                    style={{ marginHorizontal: 5 }}
                  />
                  <Text style={{ color: colors.appWhite, fontWeight: 'bold' }}>
                    Yes
                  </Text>
                </View>
                {setDescription && value && (
                  <Input
                    containerStyle={{ marginTop: 15 }}
                    value={description}
                    multiline
                    onChangeText={setDescription}
                    placeholder={descriptionPlaceholder}
                  />
                )}
              </View>
              <Divider />
            </Fragment>
          );
        },
      )}

      <TouchableOpacity
        onPress={() => setConfirmQuestionnaire(!confirmQuestionnaire)}
        style={{
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center',
        }}
      >
        <Checkbox
          checked={confirmQuestionnaire}
          onPress={() => setConfirmQuestionnaire(!confirmQuestionnaire)}
          iconStyle={{ color: colors.appWhite }}
        />
        <Text style={{ color: colors.appWhite, flex: 1, marginLeft: 10 }}>
          I have read, understood and accurately completed this questionnaire. I
          confirm that I am voluntarily engaging in an acceptable level of
          exercise and my participation involves a risk of injury. If I have
          answered YES to one of the above questions, I have sought medical
          advice and my GP has agreed that I may exercise.
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default PhysicalActivityReadiness;
