import Snackbar from 'react-native-snackbar';
import {call, put, takeLatest} from 'redux-saga/effects';
import {
  GET_EDUCATION,
  setEducation,
  setEducationLoading,
} from '../actions/education';
import * as api from '../helpers/api';
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

export default function* eductionSaga() {
  yield takeLatest(GET_EDUCATION, getEducation);
}
