import {Sample, StepSample} from '../Shared';

export default interface DailyActivityProps {
  getSamplesAction: () => void;
  weeklySteps: StepSample[];
}
