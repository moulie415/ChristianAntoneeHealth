import {SettingsActions, SET_SETTINGS} from '../actions/settings';

export interface SettingsState {
  ads: boolean;
  admins: string[];
  plansEnabled: boolean;
}

const initialState: SettingsState = {
  ads: true,
  admins: [],
  plansEnabled: false,
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
