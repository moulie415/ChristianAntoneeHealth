import Snackbar from 'react-native-snackbar';
import {eventChannel, EventChannel} from 'redux-saga';
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {GET_PLAN, setPlan} from '../actions/plan';
import {setLoading, setPlanStatus} from '../actions/profile';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import Profile, {PlanStatus} from '../types/Profile';
import {MyRootState, Plan} from '../types/Shared';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

function onPlanChanged(uid: string) {
  return eventChannel(emitter => {
    const subscriber = db()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        snapshot => {
          emitter(snapshot);
        },
        error => {
          logError(error);
        },
      );
    return subscriber;
  });
}

function* planWatcher(uid: string) {
  const channel: EventChannel<FirebaseFirestoreTypes.DocumentSnapshot> =
    yield call(onPlanChanged, uid);
  while (true) {
    const user: FirebaseFirestoreTypes.DocumentSnapshot = yield take(channel);
    yield call(handlePlanUpdate, user.data() as Profile);
  }
}

function* handlePlanUpdate(user: Profile) {
  try {
    yield put(setLoading(true));
    yield put(setPlanStatus(user.planStatus));
    if (user.planStatus === PlanStatus.COMPLETE) {
      const plan: Plan = yield call(api.getPlan, user.uid);
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

function* getPlanWorker() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield fork(planWatcher, uid);
  } catch (e) {
    logError(e);
  }
}

export default function* planSaga() {
  yield all([takeLatest(GET_PLAN, getPlanWorker)]);
}
