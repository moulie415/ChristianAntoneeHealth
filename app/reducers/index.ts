import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import education from './education';
import exercises from './exercises';
import leaderboards from './leaderboards';
import profile from './profile';
import quickRoutines from './quickRoutines';
import recipes from './recipes';
import settings from './settings';
import tests from './tests';

const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['exercises', 'profile', 'education', 'recipes', 'leaderboards'],
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

const recipesPersistConfig = {
  key: 'recipes',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const leaderboardsPersistConfig = {
  key: 'leaderboards',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const rootReducer = combineReducers({
  profile: persistReducer(profilePersistConfig, profile),
  exercises: persistReducer(exercisesPersistConfig, exercises),
  tests,
  quickRoutines,
  education: persistReducer(educationPersistConfig, education),
  settings,
  recipes: persistReducer(recipesPersistConfig, recipes),
  leaderboards: persistReducer(leaderboardsPersistConfig, leaderboards),
});

export default persistReducer(config, rootReducer);
