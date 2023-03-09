import {SettingsActions, SET_SETTINGS} from '../actions/settings';

export interface SettingsState {
  ads: boolean;
  admins: string[];
}

const initialState: SettingsState = {
  ads: true,
  admins: [],
};

const reducer = (
  state = initialState,
  action: SettingsActions,
): SettingsState => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;
    default:
      return state;
  }
};
export default reducer;
