import {CommonActions} from '@react-navigation/core';
import {createNavigationContainerRef} from '@react-navigation/native';
import {StackParamList, store} from './App';

export const navigationRef = createNavigationContainerRef<StackParamList>();

export function navigate(name: keyof StackParamList, params?: any) {
  if (navigationRef.current) {
    navigationRef.current?.navigate(name, params);
  }
}

export function resetToTabs() {
  if (navigationRef.current?.getCurrentRoute().name === 'Tabs') {
    return;
  }
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Tabs'}],
    }),
  );
}

export function resetToWelcome() {
  if (navigationRef.current?.getCurrentRoute().name === 'Login') {
    return;
  }
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
