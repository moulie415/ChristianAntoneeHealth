import Snackbar from 'react-native-snackbar';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {GET_PLAN, setPlan} from '../actions/plan';
import {setLoading, setPlanStatus} from '../actions/profile';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import Profile, {PlanStatus} from '../types/Profile';
import {MyRootState, Plan} from '../types/Shared';

function* getPlanWorker() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const user: Profile = yield call(api.getUser, uid);
    yield put(setPlanStatus(user.planStatus));
    if (user.planStatus === PlanStatus.COMPLETE) {
      const plan: Plan = yield call(api.getPlan, uid);
      if (!plan) {
        throw Error('Plan not found');
      }
      yield put(setPlan(plan));
      yield put(setLoading(false));
    }
  } catch (e) {
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching plan'});
  }
}

export default function* planSaga() {
  yield all([takeLatest(GET_PLAN, getPlanWorker)]);
}
