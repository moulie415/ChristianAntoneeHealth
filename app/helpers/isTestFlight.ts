import {Platform} from 'react-native';
import RNTestFlight from 'react-native-test-flight';

const isTestFlight = () => {
  return Platform.OS === 'ios' && RNTestFlight.isTestFlight;
};

export default isTestFlight;
