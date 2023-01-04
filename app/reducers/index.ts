import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profile from './profile';
import exercises from './exercises';
import tests from './tests';
import quickRoutines from './quickRoutines';
import education from './education';
import settings from './settings';
import tour from './tour';
import {combineReducers} from 'redux';

const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['exercises', 'profile', 'education', 'music', 'tour'],
};

const exercisesPersistConfig = {
  key: 'exercises',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const profilePersistConfig = {
  key: 'profile',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const educationPersistConfig = {
  key: 'education',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const tourPersistConfig = {
  key: 'tour',
  storage: AsyncStorage,
  blacklist: ['step'],
};

const rootReducer = combineReducers({
  profile: persistReducer(profilePersistConfig, profile),
  exercises: persistReducer(exercisesPersistConfig, exercises),
  tests,
  quickRoutines,
  education: persistReducer(educationPersistConfig, education),
  settings,
  tour: persistReducer(tourPersistConfig, tour),
});

export default persistReducer(config, rootReducer);
