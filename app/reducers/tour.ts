import {
  CANCEL_TOUR,
  DECREMENT_STEP,
  INCREMENT_STEP,
  SET_HAS_VIEWED_TOUR,
  START_TOUR,
  TourActions,
} from '../actions/tour';

export interface TourState {
  hasViewedTour: boolean;
  step?: number;
}

const initialState: TourState = {
  hasViewedTour: false,
};

const reducer = (state = initialState, action: TourActions): TourState => {
  switch (action.type) {
    case SET_HAS_VIEWED_TOUR:
      return {...state, hasViewedTour: true};
    case START_TOUR:
      return {...state, step: 1};
    case CANCEL_TOUR:
      return {...state, step: undefined};
    case INCREMENT_STEP:
      return {...state, step: state.step && state.step + 1};
    case DECREMENT_STEP:
      return {...state, step: state.step && state.step - 1};
    default:
      return state;
  }
};
export default reducer;
