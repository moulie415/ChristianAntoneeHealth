import {PayloadAction} from '@reduxjs/toolkit';
import Snackbar from 'react-native-snackbar';
import {call, put, select, throttle} from 'redux-saga/effects';
import {RootState} from '../App';
import * as api from '../helpers/api';
import {
  GET_EDUCATION,
  GET_EDUCATION_BY_ID,
  setEducation,
  setEducationLoading,
} from '../reducers/education';
import Education from '../types/Education';

function* getEducation() {
  try {
    yield put(setEducationLoading(true));
    const education: {[key: string]: Education} = yield call(api.getEducation);
    yield put(setEducation(education));
  } catch (e) {
    Snackbar.show({text: 'Error fetching education'});
  }
  yield put(setEducationLoading(false));
}

function* getEducationById(action: PayloadAction<string[]>) {
  try {
    const ids = action.payload;
    yield put(setEducationLoading(true));
    if (ids.length) {
      const education: {[key: string]: Education} = yield call(
        api.getEducationById,
        ids,
      );
      const current: {[key: string]: Education} = yield select(
        (state: RootState) => state.education.education,
      );
      yield put(setEducation({...current, ...education}));
    }
    yield put(setEducationLoading(false));
  } catch (e) {
    yield put(setEducationLoading(false));
    Snackbar.show({text: 'Error fetching education'});
  }
}

export default function* eductionSaga() {
  yield throttle(5000, GET_EDUCATION, getEducation);
  yield throttle(5000, GET_EDUCATION_BY_ID, getEducationById);
}
