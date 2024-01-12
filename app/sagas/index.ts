import {all, fork} from 'redux-saga/effects';
import appStateSaga from './appState';
import educationSaga from './education';
import exercisesSaga from './exercises';
import planSaga from './plan';
import profileSaga from './profile';
import quickRoutinesSaga from './quickRoutines';
import recipesSaga from './recipes';
import testsSaga from './tests';
import watchSaga from './watch';

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
    fork(recipesSaga),
  ]);
}
