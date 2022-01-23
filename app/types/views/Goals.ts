import {Goal} from '../Shared';
export default interface GoalsProps {
  workoutFrequency: number;
  setWorkoutFrequency: (frequency: number) => void;
  purpose?: Goal;
  setPurpose: (purpose: Goal) => void;
  signUp: () => void;
  loading: boolean;
};
