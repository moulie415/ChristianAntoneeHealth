import {all, fork} from 'redux-saga/effects';
import profileSaga from './profile';
import exercisesSaga from './exercises';
import testsSaga from './tests';
import quickRoutinesSaga from './quickRoutines';
import educationSaga from './education';
import appStateSaga from './appState';
import planSaga from './plan';
import watchSaga from './watch';
import musicSaga from './music';

export default function* rootSaga() {
  yield all([
    fork(profileSaga),
    fork(exercisesSaga),
    fork(testsSaga),
    fork(quickRoutinesSaga),
    fork(educationSaga),
    fork(appStateSaga),
    fork(planSaga),
    fork(watchSaga),
    // fork(musicSaga),
  ]);
}
