import {call, put} from 'redux-saga/effects';
import * as api from '../helpers/api';
import {SettingsState, setSettings} from '../reducers/settings';

export function* getSettings() {
  try {
    const settings: SettingsState = yield call(api.getSettings);
    yield put(setSettings(settings));
  } catch (e) {
    console.warn('error fetching settings');
  }
}
