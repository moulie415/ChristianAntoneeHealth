import React from 'react';
import reducer from './reducers';
import {Provider} from 'react-redux';
import Purchases from 'react-native-purchases';
import {PersistGate} from 'redux-persist/lib/integration/react';
import Shake from '@shakebugs/react-native-shake';
import {persistStore} from 'redux-persist';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import 'react-native-gesture-handler';
import Login from './components/views/Login';
import Home from './components/views/Home';
import Workout from './components/views/Workout';
import FitnessTesting from './components/views/FitnessTesting';
import Education from './components/views/Education';
import More from './components/views/More';
import SignUp from './components/views/SignUp';
import Welcome from './components/views/Welcome';
import colors from './constants/colors';
import Profile from './components/views/Profile';
import Notifications from './components/views/Notifications';
import Premium from './components/views/Premium';
import Support from './components/views/Support';
import Terms from './components/views/Terms';
import Settings from './components/views/Settings';
import About from './components/views/About';
import rootSaga from './sagas';
import {navigate, navigationRef} from './RootNavigation';
import SignUpFlow from './components/views/SignUpFlow';
import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';
import Activity from './components/views/Activity';
import {Goal, Level, StrengthArea} from './types/Shared';
import ExerciseList from './components/views/ExerciseList';
import ExerciseType from './types/Exercise';
import CustomizeExercise from './components/views/CustomizeExercise';
import EducationWebView from './components/views/EducationWebView';
import ExerciseListHeaderRight from './components/commons/ExerciseListHeaderRight';
import ReviewExercises from './components/views/ReviewExercises';
import StartWorkout from './components/views/StartWorkout';
import EndWorkout from './components/views/EndWorkout';
import WorkoutSummary from './components/views/WorkoutSummary';
import {useEffect} from 'react';
import Policies from './components/views/Policies';
import Loading from './components/views/Loading';
import {setNavigationAction} from './actions/profile';

const composeEnhancers =
  // @ts-ignore
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type StackParamList = {
  Login: undefined;
  SignUp: undefined;
  SignUpFlow: {dry?: boolean};
  Welcome: undefined;
  Tabs: undefined;
  Home: undefined;
  Exercise: {id: string};
  Activity: undefined;
  Fitness: undefined;
  Test: {id: string};
  ExerciseList: {strengthArea: StrengthArea; level: Level; goals: Goal[]};
  CustomizeExercise: {exercise: ExerciseType};
  ReviewExercises: undefined;
  StartWorkout: undefined;
  EndWorkout: {seconds: number};
  WorkoutSummary: {seconds: number; calories: number; difficulty: number};
  Education: undefined;
  EducationWebView: {url: string};
  Settings: undefined;
  More: undefined;
  Profile: undefined;
  History: undefined;
  Notifications: undefined;
  Premium: undefined;
  Support: undefined;
  Terms: undefined;
  Workout: undefined;
  About: undefined;
  Policies: undefined;
  Loading: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<StackParamList>();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.appBlue,
        tabBarInactiveTintColor: '#7c7c7c',
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="home" />
          ),
        }}
        name="Home"
        key="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Workout',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="dumbbell" />
          ),
        }}
        name="Workout"
        key="Workout"
        component={Workout}
      />
      {/* <Tab.Screen
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="chart-line" />
          ),
        }}
        key="Activity"
        name="Activity"
        component={Activity}
      /> */}
      <Tab.Screen
        options={{
          tabBarLabel: 'Fitness',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="heartbeat" />
          ),
        }}
        key="Fitness"
        name="Fitness"
        component={FitnessTesting}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="ellipsis-h" />
          ),
        }}
        key="More"
        name="More"
        component={More}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    Shake.setInvokeShakeOnShakeDeviceEvent(false);
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup('qyiMfgjJHVvhxXVRPnXgECYFkphIJwhb');
    Sentry.init({
      dsn:
        'https://451fc54217394f32ae7fa2e15bc1280e@o982587.ingest.sentry.io/5937794',
    });
  }, []);
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              SplashScreen.hide();
              const action = store.getState().profile.navigationAction;
              if (action) {
                navigate(action);
                store.dispatch(setNavigationAction(undefined));
              }
            }}>
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
              </Stack.Group>
              <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="Premium" component={Premium} />
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </Provider>
    </PersistGate>
  );
};

export default App;
