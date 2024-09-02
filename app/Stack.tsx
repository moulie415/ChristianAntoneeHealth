import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Dimensions} from 'react-native';
import {StackParamList} from './App';
import EducationTabs from './EducationTabs';
import SavedItemsTabs from './SavedItemsTabs';
import Tabs from './Tabs';
import ExerciseListHeaderRight from './components/commons/ExerciseListHeaderRight';
import HeaderShareButton from './components/commons/HeaderShareButton';
import PDFViewer from './components/commons/PDFViewer';
import WebViewScreen from './components/commons/WebViewScreen';
import DeleteAccount from './components/views/DeleteAccount';
import About from './components/views/DrawerContent/About';
import AddConnection from './components/views/DrawerContent/AddConnection';
import Chat from './components/views/DrawerContent/Chat/Chat';
import VideoView from './components/views/DrawerContent/Chat/VideoView';
import Connections from './components/views/DrawerContent/Connections';
import DrawerContent from './components/views/DrawerContent/DrawerContent';
import Notifications from './components/views/DrawerContent/Notifications';
import Policies from './components/views/DrawerContent/Policies';
import Premium from './components/views/DrawerContent/Premium';
import PremiumPurchased from './components/views/DrawerContent/PremiumPurchased';
import ReportProblem from './components/views/DrawerContent/ReportProblem';
import Settings from './components/views/DrawerContent/Settings';
import Terms from './components/views/DrawerContent/Terms';
import EducationArticle from './components/views/Education/EducationArticle';
import ForgotPassword from './components/views/ForgotPassword';
import Loading from './components/views/Loading';
import Login from './components/views/Login';
import LoginEmail from './components/views/LoginEmail';
import Offline from './components/views/Offline';
import MonthlyDayView from './components/views/Plan/MonthlyDayView';
import PlanNutrition from './components/views/Plan/PlanNutrition';
import PlanSleep from './components/views/Plan/PlanSleep';
import EndQuickRoutine from './components/views/QuickRoutines/EndQuickRoutine';
import PreQuickRoutine from './components/views/QuickRoutines/PreQuickRoutine';
import QuickRoutineView from './components/views/QuickRoutines/QuickRoutine';
import QuickRoutineSummary from './components/views/QuickRoutines/QuickRoutineSummary';
import Rating from './components/views/Rating';
import Recipe from './components/views/Recipes/Recipe';
import RecipeCategories from './components/views/Recipes/RecipeCategories';
import Recipes from './components/views/Recipes/Recipes';
import SignUp from './components/views/SignUp';
import SignUpFlow from './components/views/SignUpFlow/SignUpFlow';
import TargetModal from './components/views/TargetModal';
import FitnessTesting from './components/views/Tests/FitnessTesting';
import Test from './components/views/Tests/Test';
import TestResults from './components/views/Tests/TestResults';
import UpdatePrompt from './components/views/UpdatePrompt';
import ViewProfile from './components/views/ViewProfile';
import CustomizeExercise from './components/views/Workout/CustomizeExercise';
import EndWorkout from './components/views/Workout/EndWorkout';
import ExerciseList from './components/views/Workout/ExerciseList';
import Experience from './components/views/Workout/Experience';
import FitnessGoal from './components/views/Workout/FitnessGoal';
import PreWorkout from './components/views/Workout/PreWorkout';
import ReviewExercises from './components/views/Workout/ReviewExercises';
import StartWorkout from './components/views/Workout/StartWorkout';
import WarmUp from './components/views/Workout/WarmUp';
import WhatArea from './components/views/Workout/WhatArea';
import WorkoutBreakdown from './components/views/Workout/WorkoutBreakdown';
import WorkoutList from './components/views/Workout/WorkoutList';
import WorkoutSummary from './components/views/Workout/WorkoutSummary';

const Drawer = createDrawerNavigator();

const DContent = (props: DrawerContentComponentProps) => (
  <DrawerContent {...props} />
);

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      defaultStatus="closed"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: Dimensions.get('screen').width - 100,
        },
        swipeEnabled: false,
      }}
      drawerContent={DContent}>
      <Drawer.Screen name="Stack" component={StackComponent} />
    </Drawer.Navigator>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const StackComponent: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={({route, navigation}) => ({
        headerShown: false,
      })}>
      <Stack.Group>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginEmail" component={LoginEmail} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="SignUpFlow" component={SignUpFlow} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="FitnessGoal" component={FitnessGoal} />
        <Stack.Screen name="Experience" component={Experience} />
        <Stack.Screen name="WarmUp" component={WarmUp} />
        <Stack.Screen name="Fitness" component={FitnessTesting} />
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
            headerRight: () => <HeaderShareButton />,
          })}
        />
        <Stack.Screen name="CustomizeExercise" component={CustomizeExercise} />
        <Stack.Screen name="PreWorkout" component={PreWorkout} />
        <Stack.Screen name="StartWorkout" component={StartWorkout} />
        <Stack.Screen name="EndWorkout" component={EndWorkout} />
        <Stack.Screen name="WorkoutSummary" component={WorkoutSummary} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="EducationArticle" component={EducationArticle} />
        <Stack.Screen name="Policies" component={Policies} />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="TestResults" component={TestResults} />
        <Stack.Screen name="PreQuickRoutine" component={PreQuickRoutine} />
        <Stack.Screen name="QuickRoutine" component={QuickRoutineView} />
        <Stack.Screen name="EndQuickRoutine" component={EndQuickRoutine} />
        <Stack.Screen
          name="QuickRoutineSummary"
          component={QuickRoutineSummary}
        />

        <Stack.Screen name="SavedItems" component={SavedItemsTabs} />
        <Stack.Screen name="AddConnection" component={AddConnection} />

        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="VideoView" component={VideoView} />
        <Stack.Screen name="WhatArea" component={WhatArea} />
        <Stack.Screen name="WorkoutList" component={WorkoutList} />
        <Stack.Screen name="Education" component={EducationTabs} />
        <Stack.Screen name="Connections" component={Connections} />
        <Stack.Screen name="Premium" component={Premium} />
        <Stack.Screen name="PremiumPurchased" component={PremiumPurchased} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Rating" component={Rating} />
        <Stack.Screen name="Nutrition" component={PlanNutrition} />
        <Stack.Screen name="Sleep" component={PlanSleep} />
        <Stack.Screen name="MonthlyDayView" component={MonthlyDayView} />
        <Stack.Screen name="ViewProfile" component={ViewProfile} />
        <Stack.Screen name="Recipes" component={Recipes} />
        <Stack.Screen name="RecipeCategories" component={RecipeCategories} />
        <Stack.Screen name="Recipe" component={Recipe} />
        <Stack.Screen name="PDFViewer" component={PDFViewer} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
        <Stack.Screen name="ReportProblem" component={ReportProblem} />
        <Stack.Screen name="WorkoutBreakdown" component={WorkoutBreakdown} />
        <Stack.Screen name="Offline" component={Offline} />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="UpdatePrompt" component={UpdatePrompt} />
        <Stack.Screen name="TargetModal" component={TargetModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackComponent;
