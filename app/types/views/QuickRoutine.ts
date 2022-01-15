import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';

type QuickRoutinesRouteProp = RouteProp<StackParamList, 'QuickRoutine'>;

type QuickRoutinesNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'QuickRoutine'
>;

export default interface QuickRoutineProps {
  downloadVideoAction: (id: string) => void;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  route: QuickRoutinesRouteProp;
  navigation: QuickRoutinesNavigationProp;
  getExercisesByIdAction: (ids: string[]) => void;
  setExerciseNoteAction: (exercise: string, note: string) => void;
  exerciseNotes: {[key: string]: string};
  exercisesObj: {[key: string]: Exercise};
};
