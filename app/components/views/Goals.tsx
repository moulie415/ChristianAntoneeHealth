import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../styles/views/Goals';
import GoalsProps from '../../types/views/Goals';
import {Goal, Purpose} from '../../types/Shared';
import {
  Select,
  SelectItem,
  Button,
  Input,
  IndexPath,
} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';

interface PurposeItem {
  title: string;
  purpose: Purpose;
}

const Goals: React.FC<GoalsProps> = ({
  selectedGoals,
  setSelectedGoals,
  workoutFrequency,
  setWorkoutFrequency,
  purpose,
  setPurpose,
  signUp,
}) => {
  const purposeItems: PurposeItem[] = [
    {title: 'Increase exercise and activity', purpose: Purpose.EXERCISE},
    {title: 'Burn calories', purpose: Purpose.CALORIES},
    {title: 'Improve fitness', purpose: Purpose.FITNESS},
  ];
  const selectGoal = (goal: Goal) => {
    selectedGoals.includes(goal)
      ? setSelectedGoals(selectedGoals.filter(t => t !== goal))
      : setSelectedGoals([...selectedGoals, goal]);
  };
  const CheckIcon = ({goal}: {goal: Goal}) => {
    return selectedGoals.includes(goal) ? (
      <Icon name="check" size={12} style={{color: '#fff'}} />
    ) : null;
  };
  const CrossIcon = ({goal}: {goal: Goal}) => {
    return selectedGoals.includes(goal) ? (
      <Icon name="times" size={12} />
    ) : null;
  };
  return (
    <View style={{margin: 20}}>
      <Text style={{color: '#fff', marginTop: 30, marginBottom: 10}}>
        What is your main purpose for using this app?
      </Text>
      <Select
        value={
          purpose
            ? purposeItems.find(item => item.purpose === purpose).title
            : ' '
        }
        onSelect={index => {
          if ('row' in index) {
            setPurpose(purposeItems[index.row].purpose);
          }
        }}
        selectedIndex={
          new IndexPath(
            purposeItems.findIndex(item => item.purpose === purpose),
          )
        }>
        {purposeItems.map(item => {
          return (
            <SelectItem
              key={item.purpose}
              selected={item.purpose === purpose}
              title={item.title}
            />
          );
        })}
      </Select>
      <Text style={{color: '#fff', marginTop: 30, marginBottom: 10}}>
        What is your main purpose for using this app?
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}>
        <Button
          size="tiny"
          accessoryLeft={() => <CheckIcon goal={Goal.FLEXIBILITY} />}
          accessoryRight={() => <CrossIcon goal={Goal.FLEXIBILITY} />}
          onPress={() => selectGoal(Goal.FLEXIBILITY)}
          status={
            selectedGoals.includes(Goal.FLEXIBILITY) ? 'primary' : 'basic'
          }
          style={{
            width: 120,
            marginBottom: 20,
          }}>
          Flexibility
        </Button>
        <Button
          size="tiny"
          accessoryLeft={() => <CheckIcon goal={Goal.STRENGTH} />}
          accessoryRight={() => <CrossIcon goal={Goal.STRENGTH} />}
          onPress={() => selectGoal(Goal.STRENGTH)}
          status={selectedGoals.includes(Goal.STRENGTH) ? 'primary' : 'basic'}
          style={{
            width: 120,
            marginBottom: 20,
          }}>
          Strength
        </Button>
        <Button
          size="tiny"
          accessoryLeft={() => <CheckIcon goal={Goal.BALANCE} />}
          accessoryRight={() => <CrossIcon goal={Goal.BALANCE} />}
          onPress={() => selectGoal(Goal.BALANCE)}
          status={selectedGoals.includes(Goal.BALANCE) ? 'primary' : 'basic'}
          style={{
            width: 120,
            marginBottom: 20,
          }}>
          Balance
        </Button>
        <Button
          size="tiny"
          accessoryLeft={() => <CheckIcon goal={Goal.CARDIO} />}
          accessoryRight={() => <CrossIcon goal={Goal.CARDIO} />}
          onPress={() => selectGoal(Goal.CARDIO)}
          status={selectedGoals.includes(Goal.CARDIO) ? 'primary' : 'basic'}
          style={{
            width: 120,
            marginBottom: 20,
          }}>
          Cardiovascular
        </Button>
      </View>
      <Text style={{color: '#fff', marginTop: 30, marginBottom: 20}}>
        How many times a week do you want to workout?
      </Text>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <TouchableOpacity
          onPress={() => {
            if (workoutFrequency > 1) {
              setWorkoutFrequency(workoutFrequency - 1);
            }
          }}>
          <Icon name="minus" color={colors.appBlue} size={25} />
        </TouchableOpacity>
        <Input
          style={{marginHorizontal: 10, width: 70}}
          textAlign="center"
          keyboardType="numeric"
          returnKeyType="done"
          value={workoutFrequency.toString()}
          onChangeText={text => {
            if (!isNaN(Number(text))) {
              setWorkoutFrequency(Number(text));
            }
            if (!text) {
              setWorkoutFrequency(1);
            }
          }}
        />
        <TouchableOpacity
          onPress={() => setWorkoutFrequency(workoutFrequency + 1)}>
          <Icon name="plus" color={colors.appBlue} size={25} />
        </TouchableOpacity>
      </View>
      <Button disabled={!purpose} onPress={signUp}>
        Create Account
      </Button>
    </View>
  );
};

export default Goals;
