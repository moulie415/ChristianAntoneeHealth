import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import {Sample, StepSample} from '../Shared';

type ActivityNavigationProp = StackNavigationProp<StackParamList, 'Activity'>;

export default interface ActivityProps {
  navigation: ActivityNavigationProp;
  getSamplesAction: () => void;
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
};
