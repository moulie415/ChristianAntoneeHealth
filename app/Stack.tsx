import React, {FunctionComponent} from 'react';
import {StackParamList} from './App';
import {createStackNavigator} from '@react-navigation/stack';
import Premium from './components/views/More/Premium';
import Loading from './components/views/Loading';
import ExerciseList from './components/views/Workout/ExerciseList';
import CustomizeExercise from './components/views/Workout/CustomizeExercise';
import EducationWebView from './components/views/More/EducationWebView';
import ExerciseListHeaderRight from './components/commons/ExerciseListHeaderRight';
import ReviewExercises from './components/views/Workout/ReviewExercises';
import StartWorkout from './components/views/Workout/StartWorkout';
import EndWorkout from './components/views/Workout/EndWorkout';
import WorkoutSummary from './components/views/Workout/WorkoutSummary';
import Policies from './components/views/More/Policies';
import Test from './components/views/Tests/Test';
import QuickRoutines from './components/views/QuickRoutines/QuickRoutines';
import QuickRoutineView from './components/views/QuickRoutines/QuickRoutine';
import TestResults from './components/views/Tests/TestResults';
import Tabs from './Tabs';
import QuickRoutinesTabs from './QuickRoutinesTabs';
import Login from './components/views/Login';
import Education from './components/views/More/Education';
import SignUp from './components/views/SignUp';
import Welcome from './components/views/Welcome';
import Profile from './components/views/More/Profile';
import Notifications from './components/views/More/Notifications';
import Support from './components/views/More/Support';
import Terms from './components/views/More/Terms';
import Settings from './components/views/More/Settings';
import About from './components/views/More/About';
import SignUpFlow from './components/views/SignUpFlow';
import SavedItemsTabs from './SavedItemsTabs';
import EndQuickRoutine from './components/views/QuickRoutines/EndQuickRoutine';
import QuickRoutineSummary from './components/views/QuickRoutines/QuickRoutineSummary';

const Stack = createStackNavigator<StackParamList>();

const StackComponent: FunctionComponent = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={({route, navigation}) => ({
          headerBackTitle: null,
        })}>
        <Stack.Group>
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerTitle: 'Sign up'}}
          />
          <Stack.Screen
            name="SignUpFlow"
            component={SignUpFlow}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="ExerciseList"
            component={ExerciseList}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerRight: () => (
                <ExerciseListHeaderRight navigation={navigation} />
              ),
            })}
          />
          <Stack.Screen
            name="ReviewExercises"
            component={ReviewExercises}
            options={({navigation}) => ({
              headerTitle: 'Workout',
            })}
          />
          <Stack.Screen
            name="CustomizeExercise"
            component={CustomizeExercise}
            options={() => ({
              headerTitle: 'Workout',
            })}
          />
          <Stack.Screen
            name="StartWorkout"
            component={StartWorkout}
            options={({navigation}) => ({
              headerTitle: 'Workout',
            })}
          />
          <Stack.Screen
            name="EndWorkout"
            component={EndWorkout}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerLeft: null,
            })}
          />
          <Stack.Screen
            name="WorkoutSummary"
            component={WorkoutSummary}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerLeft: null,
            })}
          />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Education" component={Education} />
          <Stack.Screen
            name="EducationWebView"
            component={EducationWebView}
            options={{headerTitle: ''}}
          />
          <Stack.Screen name="Policies" component={Policies} />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen
            name="TestResults"
            component={TestResults}
            options={({navigation}) => ({
              headerTitle: '',
            })}
          />
          <Stack.Screen
            name="QuickRoutines"
            component={QuickRoutines}
            options={({navigation}) => ({
              headerTitle: 'Quick Routines',
            })}
          />
          <Stack.Screen
            name="QuickRoutinesTabs"
            component={QuickRoutinesTabs}
            options={({navigation}) => ({
              headerTitle: 'Quick Routines',
            })}
          />
          <Stack.Screen
            name="QuickRoutine"
            component={QuickRoutineView}
            options={({navigation}) => ({
              headerTitle: 'Quick Routine',
            })}
          />
          <Stack.Screen
            name="EndQuickRoutine"
            component={EndQuickRoutine}
            options={({navigation}) => ({
              headerTitle: 'Quick Routine',
            })}
          />
          <Stack.Screen
            name="QuickRoutineSummary"
            component={QuickRoutineSummary}
            options={({navigation}) => ({
              headerTitle: 'Quick Routine',
            })}
          />
          <Stack.Screen
            name="SavedItems"
            component={SavedItemsTabs}
            options={{headerTitle: ''}}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen name="Premium" component={Premium} />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export default StackComponent;
