import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {Sample, StepSample} from '../Shared';

type ActivityNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Activity'
>;

export default interface ActivityProps {
  navigation: ActivityNavigationProp;
  getSamplesAction: () => void;
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
}
