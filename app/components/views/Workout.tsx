import React, {useState} from 'react';
import styles from '../../styles/views/Workout';
import {TouchableOpacity, ScrollView} from 'react-native';
import colors from '../../constants/colors';
import WorkoutProps from '../../types/views/Workout';
import {Text, Button, CheckBox, Layout} from '@ui-kitten/components';
import {Goal, Level, MyRootState, StrengthArea} from '../../types/Shared';
import {setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';
import ImageOverlay from '../commons/ImageOverlay';

const Workout: React.FC<WorkoutProps> = ({
  navigation,
  setWorkoutAction,
  profile,
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
  const areaDisabled =
    goals.includes(Goal.CARDIO) ||
    goals.includes(Goal.FLEXIBILITY) ||
    goals.includes(Goal.BALANCE);

  return (
    <Layout style={{flex: 1}}>
      <ScrollView>
        <Text category="h5" style={{margin: 10, marginBottom: 0}}>
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

        <Text category="h5" style={{margin: 10}}>
          Select your experience
        </Text>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Button
            disabled={goals.includes(Goal.FLEXIBILITY)}
            onPress={() => setSelectedLevel(Level.BEGINNER)}
            status={selectedLevel === Level.BEGINNER ? 'primary' : 'basic'}>
            Beginner
          </Button>
          <Button
            disabled={goals.includes(Goal.FLEXIBILITY)}
            onPress={() => setSelectedLevel(Level.INTERMEDIATE)}
            status={selectedLevel === Level.INTERMEDIATE ? 'primary' : 'basic'}>
            Intermediate
          </Button>
          <Button
            disabled={goals.includes(Goal.FLEXIBILITY)}
            onPress={() => setSelectedLevel(Level.ADVANCED)}
            status={selectedLevel === Level.ADVANCED ? 'primary' : 'basic'}>
            Advanced
          </Button>
        </Layout>
        <Text category="h5" style={{margin: 10}}>
          Select an area of the body
        </Text>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            disabled={areaDisabled}
            onPress={() => setSelectedArea(StrengthArea.FULL)}
            style={{marginHorizontal: 10, flex: 1}}>
            <ImageOverlay
              containerStyle={{height: 100, width: '100%'}}
              overlayAlpha={areaDisabled ? 0.7 : 0}
              source={require('../../images/full_body.jpeg')}
            />
            <Text
              style={{
                backgroundColor:
                  selectedArea === StrengthArea.FULL && !areaDisabled
                    ? colors.appBlue
                    : '#3d3d3d',
                padding: 5,
                textAlign: 'center',
                color: '#fff',
              }}>
              Full body
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={areaDisabled}
            onPress={() => setSelectedArea(StrengthArea.UPPER)}
            style={{marginHorizontal: 10, flex: 1}}>
            <ImageOverlay
              containerStyle={{height: 100, width: '100%'}}
              overlayAlpha={areaDisabled ? 0.7 : 0}
              source={require('../../images/upper_body.jpeg')}
            />
            <Text
              style={{
                backgroundColor:
                  selectedArea === StrengthArea.UPPER && !areaDisabled
                    ? colors.appBlue
                    : '#3d3d3d',
                padding: 5,
                textAlign: 'center',
                color: '#fff',
              }}>
              Upper body
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={areaDisabled}
            onPress={() => setSelectedArea(StrengthArea.LOWER)}
            style={{marginHorizontal: 10, flex: 1}}>
            <ImageOverlay
              containerStyle={{height: 100, width: '100%'}}
              overlayAlpha={areaDisabled ? 0.7 : 0}
              source={require('../../images/lower_body.jpeg')}
            />
            <Text
              style={{
                backgroundColor:
                  selectedArea === StrengthArea.LOWER && !areaDisabled
                    ? colors.appBlue
                    : '#3d3d3d',
                padding: 5,
                textAlign: 'center',
                color: '#fff',
              }}>
              Lower body
            </Text>
          </TouchableOpacity>
        </Layout>
        <Button
          disabled={goals.length === 0}
          onPress={() => {
            if (profile.premium) {
              setWorkoutAction([]);
              navigation.navigate('ExerciseList', {
                strengthArea: selectedArea,
                level: selectedLevel,
                goals,
              });
            } else {
              navigation.navigate('Premium');
            }
          }}
          style={{margin: 10}}>
          Continue
        </Button>
      </ScrollView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
