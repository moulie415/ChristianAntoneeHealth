import React from 'react';
import reducer from './reducers';
import {Provider} from 'react-redux';
import Purchases from 'react-native-purchases';
import {PersistGate} from 'redux-persist/lib/integration/react';
import Shake from '@shakebugs/react-native-shake';
import {persistStore} from 'redux-persist';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import 'react-native-gesture-handler';
import rootSaga from './sagas';
import {navigationRef} from './RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';
import {
  CardioType,
  Goal,
  Level,
  StrengthArea,
  Equipment as EquipmentItem,
  WarmUp,
  CoolDown,
} from './types/Shared';
import ExerciseType from './types/Exercise';
import {useEffect} from 'react';
import QuickRoutine from './types/QuickRoutines';
import TestType from './types/Test';
import StackComponent from './Stack';
import {Alert, Linking} from 'react-native';
import queryString from 'query-string';

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
  TestResults: {
    testResult: number;
    testNote: string;
    test: TestType;
    seconds: number;
  };
  ExerciseList: {
    goal: Goal;
    strengthArea: StrengthArea;
    level: Level;
    cardioType: CardioType;
    equipment: EquipmentItem[];
    warmUp: WarmUp[];
    coolDown: CoolDown[];
  };
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
  QuickRoutines: undefined;
  QuickRoutinesTabs: undefined;
  QuickRoutine: {routine: QuickRoutine};
  EndQuickRoutine: {routine: QuickRoutine; seconds: number};
  QuickRoutineSummary: {
    routine: QuickRoutine;
    seconds: number;
    calories: number;
    difficulty: number;
  };
  SavedItems: undefined;
};

const handleDeepLink = (url: string) => {
  const parsed = queryString.parseUrl(url);
  if (parsed.url === 'healthandmovement://workout') {
    if (typeof parsed.query.exercises === 'string') {
      const exercises = parsed.query.exercises.split(',');
      console.log(exercises);
    }
  }
};

const linking: LinkingOptions<StackParamList> = {
  prefixes: ['healthandmovement://'],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url !== null) {
      handleDeepLink(url);
      return url;
    }
  },

  subscribe(listener) {
    const onReceiveURL = ({url}: {url: string}) => {
      handleDeepLink(url);
    };

    Linking.addEventListener('url', onReceiveURL);
  },
};

const App: React.FC = () => {
  useEffect(() => {
    Shake.setInvokeShakeOnShakeDeviceEvent(false);
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup('qyiMfgjJHVvhxXVRPnXgECYFkphIJwhb');
    if (!__DEV__) {
      Sentry.init({
        dsn:
          'https://451fc54217394f32ae7fa2e15bc1280e@o982587.ingest.sentry.io/5937794',
      });
    }
  }, []);
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer
            linking={linking}
            ref={navigationRef}
            onReady={() => {
              SplashScreen.hide();
              sagaMiddleware.run(rootSaga);
            }}>
            <StackComponent />
          </NavigationContainer>
        </ApplicationProvider>
      </Provider>
    </PersistGate>
  );
};

export default App;
