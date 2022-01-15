import {SettingsState} from '../reducers/settings';

export const SET_SETTINGS = 'SET_SETTINGS';

export interface SetSettingsAction {
  type: typeof SET_SETTINGS;
  payload: SettingsState;
}

export type SettingsActions = SetSettingsAction;

export const setSettings = (payload: SettingsState): SetSettingsAction => ({
  type: SET_SETTINGS,
  payload,
});
