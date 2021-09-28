import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import profile from './profile';
import exercises from './exercises';
import tests from './tests';
import quickRoutines from './quickRoutines';

const config = {
  key: 'root',
  storage: AsyncStorage,
};

// Combine all the reducers
export default persistCombineReducers(config, {
  profile,
  exercises,
  tests,
  quickRoutines,
});
