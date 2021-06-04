import React, {FunctionComponent, useState} from 'react';
import styles from '../../styles/views/Workout';
import {View, Image, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import WorkoutProps from '../../types/views/Workout';
import {Text, Button, CheckBox} from '@ui-kitten/components';
import {Goal, Level, StrengthArea} from '../../types/Shared';
import {setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';

const Workout: FunctionComponent<WorkoutProps> = ({
  navigation,
  setWorkoutAction,
}) => {
  const [selectedArea, setSelectedArea] = useState<StrengthArea>(
    StrengthArea.FULL,
  );
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.BEGINNER);
  const [goals, setGoals] = useState<Goal[]>([]);
  const selectGoal = (goal: Goal, checked: boolean) => {
    if (goals.includes(goal) && !checked) {
      setGoals(goals.filter(g => goal !== g));
    } else {
      setGoals([...goals, goal]);
    }
  };
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text category="h5" style={{margin: 10}}>
        Select an area of the body
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() => setSelectedArea(StrengthArea.FULL)}
          style={{marginHorizontal: 10, flex: 1}}>
          <Image
            style={{height: 100, width: '100%'}}
            resizeMode="cover"
            source={require('../../images/full_body.jpeg')}
          />
          <Text
            style={{
              backgroundColor:
                selectedArea === StrengthArea.FULL ? colors.appBlue : '#3d3d3d',
              padding: 5,
              textAlign: 'center',
            }}>
            Full body
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedArea(StrengthArea.UPPER)}
          style={{marginHorizontal: 10, flex: 1}}>
          <Image
            style={{height: 100, width: '100%'}}
            resizeMode="cover"
            source={require('../../images/upper_body.jpeg')}
          />
          <Text
            style={{
              backgroundColor:
                selectedArea === StrengthArea.UPPER
                  ? colors.appBlue
                  : '#3d3d3d',
              padding: 5,
              textAlign: 'center',
            }}>
            Upper body
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedArea(StrengthArea.LOWER)}
          style={{marginHorizontal: 10, flex: 1}}>
          <Image
            style={{height: 100, width: '100%'}}
            resizeMode="cover"
            source={require('../../images/lower_body.jpeg')}
          />
          <Text
            style={{
              backgroundColor:
                selectedArea === StrengthArea.LOWER
                  ? colors.appBlue
                  : '#3d3d3d',
              padding: 5,
              textAlign: 'center',
            }}>
            Lower body
          </Text>
        </TouchableOpacity>
      </View>
      <Text category="h5" style={{margin: 10}}>
        Select your experience
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Button
          onPress={() => setSelectedLevel(Level.BEGINNER)}
          status={selectedLevel === Level.BEGINNER ? 'primary' : 'basic'}>
          Beginner
        </Button>
        <Button
          onPress={() => setSelectedLevel(Level.INTERMEDIATE)}
          status={selectedLevel === Level.INTERMEDIATE ? 'primary' : 'basic'}>
          Intermediate
        </Button>
        <Button
          onPress={() => setSelectedLevel(Level.ADVANCED)}
          status={selectedLevel === Level.ADVANCED ? 'primary' : 'basic'}>
          Advanced
        </Button>
      </View>
      <Text category="h5" style={{margin: 10}}>
        Select your goal(s)
      </Text>
      <CheckBox
        onChange={checked => selectGoal(Goal.FLEXIBILITY, checked)}
        checked={goals.includes(Goal.FLEXIBILITY)}
        style={{margin: 10}}>
        Flexibility
      </CheckBox>
      <CheckBox
        onChange={checked => selectGoal(Goal.STRENGTH, checked)}
        checked={goals.includes(Goal.STRENGTH)}
        style={{margin: 10}}>
        Strength
      </CheckBox>
      <CheckBox
        onChange={checked => selectGoal(Goal.BALANCE, checked)}
        checked={goals.includes(Goal.BALANCE)}
        style={{margin: 10}}>
        Balance
      </CheckBox>
      <CheckBox
        onChange={checked => selectGoal(Goal.CARDIO, checked)}
        checked={goals.includes(Goal.CARDIO)}
        style={{margin: 10}}>
        Cardiovascular fitness
      </CheckBox>
      <Button
        disabled={goals.length === 0}
        onPress={() => {
          setWorkoutAction([]);
          navigation.navigate('ExerciseList', {
            strengthArea: selectedArea,
            level: selectedLevel,
            goals,
          });
        }}
        style={{margin: 10}}>
        Continue
      </Button>
    </View>
  );
};

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(null, mapDispatchToProps)(Workout);
