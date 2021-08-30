import {all, fork} from 'redux-saga/effects';
import profileSaga from './profile';
import exercisesSaga from './exercises';
import testsSaga from './tests';

export default function* rootSaga() {
  yield all([fork(profileSaga), fork(exercisesSaga), fork(testsSaga)]);
}
