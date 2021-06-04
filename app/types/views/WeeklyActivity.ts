import Profile from '../Profile';
import {Sample, StepSample} from '../Shared';

export default interface WeeklyActivityProps {
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
  profile: Profile;
};
