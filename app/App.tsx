import React, {useState} from 'react';
import reducer from './reducers';
import {Provider} from 'react-redux';
import Purchases from 'react-native-purchases';
import {PersistGate} from 'redux-persist/lib/integration/react';
// import Shake from '@shakebugs/react-native-shake';
import {persistStore} from 'redux-persist';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import rootSaga from './sagas';
import {navigationRef} from './RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';
import {
  Goal,
  Level,
  Equipment as EquipmentItem,
  WarmUp,
  CoolDown,
} from './types/Shared';
import ExerciseType from './types/Exercise';
import {useEffect} from 'react';
import QuickRoutine, {Area, Equipment} from './types/QuickRoutines';
import TestType from './types/Test';
import StackComponent from './Stack';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import appCheck from '@react-native-firebase/app-check';

import Education from './types/Education';
import Video from 'react-native-video';
import {Dimensions, Platform} from 'react-native';
import Config from 'react-native-config';
import {logError} from './helpers/error';
import MobileAds from 'react-native-google-mobile-ads';

const {height, width} = Dimensions.get('window');

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
  ForgotPassword: undefined;
  DeleteAccount: undefined;
  SignUpFlow: {fromProfile?: boolean};
  Tabs: undefined;
  Home: undefined;
  Exercise: {id: string};
  Fitness: undefined;
  Test: {id: string};
  TestResults: {
    testResult: number;
    testNote: string;
    test: TestType;
    seconds: number;
  };
  FitnessGoal: undefined;
  Experience: undefined;
  WarmUp: undefined;
  ExerciseList: {
    goal: Goal;
    level: Level;
    equipment: EquipmentItem[];
    warmUp: WarmUp[];
    coolDown: CoolDown[];
  };
  CustomizeExercise: {exercise: ExerciseType};
  ReviewExercises: undefined;
  StartWorkout: {name?: string; isLast?: boolean};
  EndWorkout: {seconds: number; name?: string; isLast?: boolean};
  WorkoutSummary: {
    seconds: number;
    calories: number;
    difficulty: number;
    isLast?: boolean;
  };
  Education: undefined;
  EducationArticle: {education: Education};
  Settings: undefined;
  More: undefined;
  Profile: undefined;
  History: undefined;
  Notifications: undefined;
  Premium: {onActivated?: () => void};
  Support: undefined;
  Terms: undefined;
  Workout: undefined;
  About: undefined;
  Policies: undefined;
  Loading: undefined;
  QuickRoutines: undefined;
  QuickRoutine: {routine: QuickRoutine};
  EndQuickRoutine: {routine: QuickRoutine; seconds: number};
  QuickRoutineSummary: {
    routine: QuickRoutine;
    seconds: number;
    calories: number;
    difficulty: number;
  };
  SavedItems: undefined;
  Connections: undefined;
  AddConnection: undefined;
  Chat: {uid: string};
  Plan: undefined;
  WhatArea: {equipment: Equipment};
  WorkoutList: {area: Area; equipment: Equipment};
  Rating: undefined;
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Shake.setInvokeShakeOnShakeDeviceEvent(false);
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup(
      Platform.OS === 'ios'
        ? Config.REVENUE_CAT_IOS_KEY
        : Config.REVENUE_CAT_ANDROID_KEY,
    );
    if (!__DEV__) {
      Sentry.init({
        dsn: 'https://451fc54217394f32ae7fa2e15bc1280e@o982587.ingest.sentry.io/5937794',
      });
    }
    if (Platform.OS === 'android') {
      appCheck()
        .activate(__DEV__ ? Config.APP_CHECK_DEBUG_TOKEN : 'ignored', true)
        .catch(e => {
          logError(e);
        });
    }

    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log(adapterStatuses);
      });
  }, []);
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            sagaMiddleware.run(rootSaga);
            SplashScreen.hide();
          }}>
          <StackComponent />
        </NavigationContainer>
        {/* {showSplash && (
            <Video
              onLoad={() => SplashScreen.hide()}
              source={require('./images/splash.mp4')}
              style={{
                height,
                width,
                backgroundColor: '#fff',
              }}
              resizeMode="cover"
              onEnd={() => setShowSplash(false)}
            />
          )} */}
      </Provider>
    </PersistGate>
  );
};

export default gestureHandlerRootHOC(App);
