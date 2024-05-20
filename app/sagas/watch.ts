import {PayloadAction} from '@reduxjs/toolkit';
import {Platform} from 'react-native';
import {
  WatchPayload,
  getReachability,
  sendMessage,
  watchEvents,
} from 'react-native-watch-connectivity';
import {EventChannel, eventChannel} from 'redux-saga';
import {all, call, select, take, takeLatest} from 'redux-saga/effects';
import {RootState} from '../App';
import {START_QUICK_ROUTINE} from '../reducers/quickRoutines';
import Exercise from '../types/Exercise';

function* startQuickRoutineWorker(
  action: PayloadAction<{id: string; exerciseIds: string[]}>,
) {
  const reachable: boolean = yield call(getReachability);
  const {id, exerciseIds} = action.payload;
  const {exercises} = yield select((state: RootState) => state.exercises);
  if (reachable) {
    const workout: Exercise[] = exerciseIds.map(e => exercises[e]);
    sendMessage({startQuickRoutine: {id}});
  }
}

interface MessageEvent {
  message: {[key: string]: any};
  reply: (resp: WatchPayload) => void;
}

function* messageHandler(event: MessageEvent) {}

function onMessage() {
  return eventChannel(emitter => {
    const unsubscribe = watchEvents.addListener('message', (message, reply) => {
      emitter({message, reply});
    });
    return unsubscribe;
  });
}

export default function* watchSaga() {
  if (Platform.OS === 'ios') {
    yield all([takeLatest(START_QUICK_ROUTINE, startQuickRoutineWorker)]);

    const messageChannel: EventChannel<MessageEvent> = yield call(onMessage);
    while (true) {
      const event: MessageEvent = yield take(messageChannel);
      yield call(messageHandler, event);
    }
  }
}
