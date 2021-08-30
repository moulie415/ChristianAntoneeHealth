import {Sample, StepSample} from '../Shared';
export default interface MonthlyActivityProps {
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
};
