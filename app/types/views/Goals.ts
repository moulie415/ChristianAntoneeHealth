import {Goal, Purpose} from '../Shared';
export default interface GoalsProps {
  selectedGoals: Goal[];
  setSelectedGoals: (goal: Goal[]) => void;
  workoutFrequency: number;
  setWorkoutFrequency: (frequency: number) => void;
  purpose?: Purpose;
  setPurpose: (purpose: Purpose) => void;
  signUp: () => void;
  loading: boolean;
};
