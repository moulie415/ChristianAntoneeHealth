import {WeeklyItems} from '../../reducers/profile';
import Exercise from '../Exercise';
import Profile from '../Profile';
import QuickRoutine from '../QuickRoutines';

export default interface WeeklyActivityProps {
  profile: Profile;
  weeklyItems: WeeklyItems;
  getWeeklyItems: () => void;
  loading: boolean;
  quickRoutines: {[key: string]: QuickRoutine};
  routinesLoading: boolean;
  exercises: {[key: string]: Exercise};
  getExercisesById: (ids: string[]) => void;
}
