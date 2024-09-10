import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {LeaderboardItem, LeaderboardType} from '../types/Shared';
import {setLoggedIn} from './profile';

export interface LeaderboardsState {
  loading: boolean;
  leaderboards: {
    [leaderboard: string]:
      | {leaderboard: LeaderboardItem[]; endTime: number}
      | undefined;
  };
}

const initialState: LeaderboardsState = {
  loading: false,
  leaderboards: {},
};

export const LEADERBOARDS = 'leaderboards';

export type LEADERBOARDS = typeof LEADERBOARDS;

export const SET_LEADERBOARD = `${LEADERBOARDS}/setLeaderboard`;
export type SET_LEADERBOARD = typeof SET_LEADERBOARD;

export const SET_LEADERBOARDS_LOADING = `${LEADERBOARDS}/setLeaderboardsLoading`;
export type SET_LEADERBOARDS_LOADING = typeof SET_LEADERBOARDS_LOADING;

export const GET_LEADERBOARD = `${LEADERBOARDS}/getLeaderboard`;
export type GET_LEADERBOARD = typeof GET_LEADERBOARD;

const LeaderboardsSlice = createSlice({
  name: LEADERBOARDS,
  initialState,
  reducers: {
    setLeaderboard: (
      state: LeaderboardsState,
      {
        payload: {leaderboard, type, endTime},
      }: PayloadAction<{
        type: LeaderboardType;
        leaderboard: LeaderboardItem[];
        endTime: number;
      }>,
    ) => {
      state.leaderboards[type] = {leaderboard, endTime};
    },
    setLeaderboardsLoading: (
      state: LeaderboardsState,
      {payload}: PayloadAction<boolean>,
    ) => {
      state.loading = payload;
    },
    getLeaderboard: (
      _: LeaderboardsState,
      __: PayloadAction<LeaderboardType>,
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

export const {setLeaderboardsLoading, setLeaderboard, getLeaderboard} =
  LeaderboardsSlice.actions;

export default LeaderboardsSlice.reducer;
