import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';
import {
  CoolDown,
  Equipment,
  Goal,
  Level,
  StrengthArea,
  WarmUp,
} from '../Shared';

type WorkoutNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Workout'
>;

export default interface WorkoutProps {
  navigation: WorkoutNavigationProp;
  setWorkoutAction: (workout: Exercise[]) => void;
  profile: Profile;
  fitnessGoal: Goal;
  strengthArea: StrengthArea;
  level: Level;
  setEquipmentAction: (equipment: Equipment[]) => void;
  equipment: Equipment[];
  warmUp: WarmUp[];
  coolDown: CoolDown[];
}
