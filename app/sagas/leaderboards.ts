import {PayloadAction} from '@reduxjs/toolkit';
import Snackbar from 'react-native-snackbar';
import {all, call, debounce, put, select, throttle} from 'redux-saga/effects';
import {RootState} from '../App';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import {
  GET_LEADERBOARD,
  SUBMIT_LEADERBOARD_SCORE,
  setLeaderboard,
  setLeaderboardsLoading,
} from '../reducers/leaderboards';
import {LeaderboardItem, LeaderboardType} from '../types/Shared';

export function* getLeaderboard(action: PayloadAction<LeaderboardType>) {
  try {
    yield put(setLeaderboardsLoading(true));
    const {payload} = action;
    const {profile} = yield select((state: RootState) => state.profile);

    if (profile.premium && profile.optedInToLeaderboards) {
      const data: {leaderboard: LeaderboardItem[]; endTime: number} =
        yield call(api.getLeaderboardData, payload);

      yield put(
        setLeaderboard({
          type: payload,
          leaderboard: data.leaderboard,
          endTime: data.endTime,
        }),
      );
    }
  } catch (e) {
    Snackbar.show({text: 'Error fetching leaderboard'});
    logError(e);
  }
  yield put(setLeaderboardsLoading(false));
}

export function* submitLeaderboardScore(
  action: PayloadAction<{score: number; type: LeaderboardType}>,
) {
  try {
    const {score, type} = action.payload;
    yield call(api.submitLeaderboardScore, score, type);
  } catch (e) {
    logError(e);
  }
}

export default function* leaderboardsSaga() {
  yield all([
    debounce(1000, GET_LEADERBOARD, getLeaderboard),
    throttle(3000, SUBMIT_LEADERBOARD_SCORE, submitLeaderboardScore),
  ]);
}
