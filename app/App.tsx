import React, {useRef, useState} from 'react';
import reducer from './reducers';
import {Provider} from 'react-redux';
import Purchases from 'react-native-purchases';
import {PersistGate} from 'redux-persist/lib/integration/react';
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
  PlanNutrition,
  PlanSleep,
} from './types/Shared';
import ExerciseType from './types/Exercise';
import {useEffect} from 'react';
import QuickRoutine, {Area, Equipment} from './types/QuickRoutines';
import TestType from './types/Test';
import StackComponent from './Stack';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import appCheck from '@react-native-firebase/app-check';
import Education from './types/Education';
import {
  Dimensions,
  Platform,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Config from 'react-native-config';
import {logError} from './helpers/error';
import MobileAds from 'react-native-google-mobile-ads';
import colors from './constants/colors';
import FastImage from 'react-native-fast-image';
import Instabug from 'instabug-reactnative';
import {
  TourGuideProvider, // Main provider
  useTourGuideController,
} from 'rn-tourguide';
import CustomTooltip from './components/commons/CustomTooltip';
import WelcomeModal from './WelcomeModal';
import Drawer from 'react-native-drawer';
import DrawerContent from './components/views/DrawerContent/DrawerContent';

const {height, width} = Dimensions.get('window');

const composeEnhancers =
  // @ts-ignore
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (__DEV__ && Platform.OS === 'android') {
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
  Goals: undefined;
  Test: {id: string};
  TestResults: {
    testResult?: number;
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
  PreWorkout: {name?: string};
  StartWorkout: {name?: string};
  EndWorkout: {seconds: number; name?: string};
  WorkoutSummary: {
    seconds: number;
    calories?: number;
    difficulty: number;
  };
  Education: undefined;
  EducationArticle: {education: Education};
  Settings: undefined;
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
  PreQuickRoutine: {routine: QuickRoutine};
  QuickRoutine: {routine: QuickRoutine};
  EndQuickRoutine: {routine: QuickRoutine; seconds: number};
  QuickRoutineSummary: {
    routine: QuickRoutine;
    seconds: number;
    calories?: number;
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
  Stack: undefined;
  Nutrition: {nutrition: PlanNutrition};
  Sleep: {sleep: PlanSleep};
};

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 5500);
  }, []);

  useEffect(() => {
    Purchases.setDebugLogsEnabled(true);
    Purchases.configure({
      apiKey:
        Platform.OS === 'ios'
          ? (Config.REVENUE_CAT_IOS_KEY as string)
          : (Config.REVENUE_CAT_ANDROID_KEY as string),
    });
    if (!__DEV__) {
      Sentry.init({
        dsn: 'https://451fc54217394f32ae7fa2e15bc1280e@o982587.ingest.sentry.io/5937794',
        integrations: [
          new Sentry.ReactNativeTracing({
            // Pass instrumentation to be used as `routingInstrumentation`
            routingInstrumentation,
            // ...
          }),
        ],
      });
    }
    if (Platform.OS === 'android') {
      appCheck()
        .activate(
          __DEV__ ? (Config.APP_CHECK_DEBUG_TOKEN as string) : 'ignored',
          true,
        )
        .catch(e => {
          logError(e);
        });
    }

    Instabug.start(
      __DEV__
        ? (Config.INSTABUG_DEV_TOKEN as string)
        : (Config.INSTABUG_PROD_TOKEN as string),
      [Instabug.invocationEvent.none],
    );

    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log(adapterStatuses);
      });
  }, []);

  const drawerRef = useRef<Drawer>(null);

  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <TourGuideProvider
          androidStatusBarVisible
          backdropColor="rgba(0,0,0,0.8)"
          tooltipComponent={CustomTooltip}>
          <Drawer
            type={Platform.OS === 'ios' ? 'displace' : 'overlay'}
            ref={drawerRef}
            tweenEasing="easeInQuad"
            tweenDuration={200}
            styles={{mainOverlay: {backgroundColor: '#000', opacity: 0}}}
            tapToClose
            tweenHandler={ratio => ({
              mainOverlay: {
                opacity: ratio / 2,
              },
            })}
            openDrawerOffset={viewPort => {
              return viewPort.width / 4;
            }}
            content={
              <DrawerContent close={() => drawerRef.current?.close()} />
            }>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                sagaMiddleware.run(rootSaga);
                SplashScreen.hide();
                // Register the navigation container with the instrumentation
                routingInstrumentation.registerNavigationContainer(
                  navigationRef,
                );
              }}>
              <StackComponent drawerRef={drawerRef} />
            </NavigationContainer>
          </Drawer>
          {showSplash && (
            <View style={{backgroundColor: colors.appWhite}}>
              {Platform.OS === 'ios' ? (
                <Image
                  source={require('./images/splash.gif')}
                  style={{
                    height,
                    width: '75%',
                    backgroundColor: colors.appWhite,
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
              ) : (
                <FastImage
                  source={require('./images/splash.gif')}
                  style={{
                    height,
                    width: '75%',
                    backgroundColor: colors.appWhite,
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
              )}
            </View>
          )}
          <WelcomeModal showSplash={showSplash} />
        </TourGuideProvider>
      </Provider>
    </PersistGate>
  );
};

export default gestureHandlerRootHOC(Sentry.wrap(App));
