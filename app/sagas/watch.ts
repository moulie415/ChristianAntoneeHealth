import {Platform} from 'react-native';
import {
  sendMessage,
  watchEvents,
  WatchPayload,
} from 'react-native-watch-connectivity';
import {eventChannel, EventChannel} from 'redux-saga';
import {all, call, put, select, take, takeLatest} from 'redux-saga/effects';
import {SetLoggedInAction, SET_LOGGED_IN} from '../actions/profile';
import {
  setQuickRoutines,
  SetSavedQuickRoutinesAction,
  SET_QUICK_ROUTINES,
} from '../actions/quickRoutines';
import {MyRootState} from '../types/Shared';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';

function* loggedInWorker(action: SetLoggedInAction) {
  const loggedIn = action.payload;
  sendMessage({loggedIn}, error => {
    if (error) {
      console.error(error);
    }
  });
}

function* setQuickRoutinesWorker(action: SetSavedQuickRoutinesAction) {
  const routines = action.payload;
  sendMessage({routines}, error => {
    if (error) {
      console.error(error);
    }
  });
}

interface MessageEvent {
  message: {[key: string]: any};
  reply: (resp: WatchPayload) => void;
}

function* messageHandler(event: MessageEvent) {
  if (event.message.isLoggedIn) {
    const {loggedIn} = yield select((state: MyRootState) => state.profile);
    event.reply({loggedIn});
  }
  if (event.message.getQuickRoutines) {
    const routines: {[key: string]: QuickRoutine} = yield call(
      api.getQuickRoutines,
    );
    event.reply({routines});
  }
}

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
    yield all([
      takeLatest(SET_LOGGED_IN, loggedInWorker),
      takeLatest(SET_QUICK_ROUTINES, setQuickRoutinesWorker),
    ]);

    const messageChannel: EventChannel<MessageEvent> = yield call(onMessage);
    while (true) {
      const event: MessageEvent = yield take(messageChannel);
      yield call(messageHandler, event);
    }
  }
}
