import * as _ from 'lodash';
import {call, put} from 'redux-saga/effects';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import {SettingsState, setSettings} from '../reducers/settings';

export function* getSettings() {
  try {
    const settings: SettingsState = yield call(api.getSettings);
    yield put(setSettings(_.omit(settings, 'clientCode')));
  } catch (e) {
    logError(e);
  }
}
