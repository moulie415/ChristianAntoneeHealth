import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type SettingsNavigationProp = StackNavigationProp<StackParamList, 'Settings'>;

export default interface SettingsProps {
  navigation: SettingsNavigationProp;
  workoutReminders: boolean;
  workoutReminderTime: string;
  setWorkoutRemindersAction: (disabled: boolean) => void;
  setWorkoutReminderTimeAction: (date: Date) => void;
  monthlyTestReminders: boolean;
  setMonthlyTestRemindersAction: (enabled: boolean) => void;
  profile: Profile;
};
