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
import * as _ from 'lodash';
import {GET_PLAN, setPlan} from '../actions/plan';
import {setLoading, setPlanStatus} from '../actions/profile';
import {logError} from '../helpers/error';
import Profile, {PlanStatus} from '../types/Profile';
import {MyRootState, Plan} from '../types/Shared';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

function onPlanChanged(uid: string) {
  return eventChannel(emitter => {
    const subscriber = db()
      .collection('plans')
      .where('user', '==', uid)
      .orderBy('createdate')
      .limitToLast(1)
      .onSnapshot(
        snapshot => {
          if (snapshot.docs[0]) {
            emitter(snapshot.docs[0].data());
          } else {
            emitter({});
          }
        },
        error => {
          logError(error);
        },
      );
    return subscriber;
  });
}

function* planWatcher() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const channel: EventChannel<Plan> = yield call(onPlanChanged, uid);
    while (true) {
      const plan: Plan | {} = yield take(channel);
      const current: Plan = yield select(
        (state: MyRootState) => state.profile.plan,
      );
      if (plan === {}) {
        yield put(setPlan(undefined));
      } else {
        if (
          current &&
          !_.isEqual(
            _.omit(current, ['lastupdate', 'createdate']),
            _.omit(plan, ['lastupdate', 'createdate']),
          )
        ) {
          Snackbar.show({text: 'Your plan has been updated'});
        }
        yield put(setPlan(plan as Plan));
      }
    }
  } catch (e) {
    logError(e);
  }
}

function onPlanStatusChanged(uid: string) {
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

function* planStateWatcher(uid: string) {
  const channel: EventChannel<FirebaseFirestoreTypes.DocumentSnapshot> =
    yield call(onPlanStatusChanged, uid);
  while (true) {
    const user: FirebaseFirestoreTypes.DocumentSnapshot = yield take(channel);
    yield call(handlePlanUpdate, user.data() as Profile);
  }
}

function* handlePlanUpdate(user: Profile) {
  yield put(setPlanStatus(user.planStatus));
  if (user.planStatus === PlanStatus.COMPLETE) {
    yield fork(planWatcher);
  }
}

function* getPlanWorker() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield fork(planStateWatcher, uid);
  } catch (e) {
    logError(e);
  }
}

export default function* planSaga() {
  yield all([takeLatest(GET_PLAN, getPlanWorker)]);
}
