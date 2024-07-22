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
import Exercise from '../types/Exercise';
import { START_WORKOUT } from '../reducers/exercises';
import { PlanWorkout } from '../types/Shared';



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

    const messageChannel: EventChannel<MessageEvent> = yield call(onMessage);
    while (true) {
      const event: MessageEvent = yield take(messageChannel);
      yield call(messageHandler, event);
    }
  }
}
