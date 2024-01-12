import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Recipe} from '../types/Shared';
import {setLoggedIn} from './profile';

export interface RecipesState {
  recipes: {[key: string]: Recipe};
  loading: boolean;
}

const initialState: RecipesState = {
  recipes: {},
  loading: false,
};

export const RECIPES = 'recipes';

export type RECIPES = typeof RECIPES;

export const SET_RECIPES = `${RECIPES}/setRecipes`;
export type SET_RECIPES = typeof SET_RECIPES;

export const SET_RECIPES_LOADING = `${RECIPES}/setRecipesLoading`;
export type SET_RECIPES_LOADING = typeof SET_RECIPES_LOADING;

export const GET_RECIPES = `${RECIPES}/getRecipes`;
export type GET_RECIPES = typeof GET_RECIPES;

export const GET_RECIPES_BY_ID = `${RECIPES}/getRecipesById`;
export type GET_RECIPES_BY_ID = typeof GET_RECIPES_BY_ID;

const recipesSlice = createSlice({
  name: RECIPES,
  initialState,
  reducers: {
    setRecipes: (
      state: RecipesState,
      {payload}: PayloadAction<{[key: string]: Recipe}>,
    ) => {
      state.recipes = payload;
    },
    setRecipesLoading: (
      state: RecipesState,
      {payload}: PayloadAction<boolean>,
    ) => {
      state.loading = payload;
    },
    getRecipes: () => {},
    getRecipesById: (
      state: RecipesState,
      {payload}: PayloadAction<string[]>,
    ) => {},
  },
  extraReducers: builder => {
    builder.addCase(setLoggedIn, (state, action) => {
      if (!action.payload) {
        return initialState;
      }
    });
  },
});

export const {setRecipesLoading, setRecipes, getRecipes, getRecipesById} =
  recipesSlice.actions;

export default recipesSlice.reducer;
