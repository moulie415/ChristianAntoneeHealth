import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UpdateProfilePayload} from '../../actions/profile';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type SettingsNavigationProp = NativeStackNavigationProp<StackParamList, 'Settings'>;

export default interface SettingsProps {
  navigation: SettingsNavigationProp;
  workoutReminders: boolean;
  workoutReminderTime: string;
  setWorkoutRemindersAction: (disabled: boolean) => void;
  setWorkoutReminderTimeAction: (date: Date) => void;
  monthlyTestReminders: boolean;
  setMonthlyTestRemindersAction: (enabled: boolean) => void;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
}
