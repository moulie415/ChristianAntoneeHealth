import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';

type StartWorkoutNavigationProp = StackNavigationProp<
  StackParamList,
  'StartWorkout'
>;

export default interface StartWorkoutProps {
  workout: Exercise[];
  setExerciseNoteAction: (exercise: string, note: string) => void;
  exerciseNotes: {[key: string]: string};
  navigation: StartWorkoutNavigationProp;
  downloadVideoAction: (id: string) => void;
  videos: {[key: string]: {src: string; path: string}};
};
