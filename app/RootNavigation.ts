import {CommonActions, ParamListBase} from '@react-navigation/core';
import {createNavigationContainerRef} from '@react-navigation/native';
import {setNavigationAction} from './actions/profile';
import {StackParamList} from './App';
import {store} from './App';

export const navigationRef = createNavigationContainerRef<StackParamList>();

export function navigate(name: keyof StackParamList, params?: ParamListBase) {
  if (navigationRef.current) {
    navigationRef.current?.navigate(name, params);
  } else {
    store.dispatch(setNavigationAction(name));
  }
}

export function resetToTabs() {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Tabs'}],
    }),
  );
}

export function resetToLogin() {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Login'}],
    }),
  );
}

export function goBack() {
  navigationRef.current.goBack();
}
