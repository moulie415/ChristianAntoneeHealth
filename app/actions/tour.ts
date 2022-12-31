export const SET_HAS_VIEWED_TOUR = 'SET_HAS_VIEWED_TOUR';
export const INCREMENT_STEP = 'INCREMENT_STEP';
export const DECREMENT_STEP = 'DECREMENT_STEP';
export const CANCEL_TOUR = 'CANCEL_TOUR';
export const START_TOUR = 'START_TOUR';

export interface SetHasViewedTourAction {
  type: typeof SET_HAS_VIEWED_TOUR;
}

export interface IncrementStepAction {
  type: typeof INCREMENT_STEP;
}

export interface DecrementStepAction {
  type: typeof DECREMENT_STEP;
}

export interface CancelTourAction {
  type: typeof CANCEL_TOUR;
}

export interface StartTourAction {
  type: typeof START_TOUR;
}

export type TourActions =
  | SetHasViewedTourAction
  | IncrementStepAction
  | DecrementStepAction
  | CancelTourAction
  | StartTourAction;

export const setHasViewedTour = (): SetHasViewedTourAction => ({
  type: SET_HAS_VIEWED_TOUR,
});

export const incrementStep = (): IncrementStepAction => ({
  type: INCREMENT_STEP,
});

export const decrementStep = (): DecrementStepAction => ({
  type: DECREMENT_STEP,
});

export const cancelTour = (): CancelTourAction => ({
  type: CANCEL_TOUR,
});

export const startTour = (): StartTourAction => ({
  type: START_TOUR,
});
