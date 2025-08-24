import {Goal} from '../Shared';
export default interface GoalsProps {
  goal?: Goal;
  setGoal: (goal: Goal) => void;
  signUp: () => void;
  loading: boolean;
}
