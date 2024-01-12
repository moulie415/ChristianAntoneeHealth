import {PayloadAction} from '@reduxjs/toolkit';
import Snackbar from 'react-native-snackbar';
import {call, put, select, throttle} from 'redux-saga/effects';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import {FAVOURITE_RECIPE, updateProfile} from '../reducers/profile';
import {
  GET_RECIPES,
  GET_RECIPES_BY_ID,
  setRecipes,
  setRecipesLoading,
} from '../reducers/recipes';
import {MyRootState, Recipe} from '../types/Shared';

function* getRecipes() {
  try {
    yield put(setRecipesLoading(true));
    const recipes: {[key: string]: Recipe} = yield call(api.getRecipes);
    yield put(setRecipes(recipes));
  } catch (e) {
    Snackbar.show({text: 'Error fetching recipes'});
  }
  yield put(setRecipesLoading(false));
}

function* getRecipesById(action: PayloadAction<string[]>) {
  try {
    const ids = action.payload;
    yield put(setRecipesLoading(true));
    if (ids.length) {
      const recipes: {[key: string]: Recipe} = yield call(
        api.getRecipesById,
        ids,
      );
      const current: {[key: string]: Recipe} = yield select(
        (state: MyRootState) => state.recipes.recipes,
      );
      yield put(setRecipes({...current, ...recipes}));
    }
    yield put(setRecipesLoading(false));
  } catch (e) {
    yield put(setRecipesLoading(false));
    Snackbar.show({text: 'Error fetching recipes'});
  }
}

function* favouriteRecipe(action: PayloadAction<string>) {
  try {
    const favouriteRecipes: string[] = yield select(
      (state: MyRootState) => state.profile.profile.favouriteRecipes,
    );
    const {profile} = yield select((state: MyRootState) => state.profile);
    const updateObj = {
      ...profile,
      favouriteRecipes,
    };
    yield call(api.updateUser, updateObj, profile.uid);
  } catch (e) {
    logError(e);
  }
}

export default function* eductionSaga() {
  yield throttle(5000, GET_RECIPES, getRecipes);
  yield throttle(5000, GET_RECIPES_BY_ID, getRecipesById);
  yield throttle(2000, FAVOURITE_RECIPE, favouriteRecipe);
}
