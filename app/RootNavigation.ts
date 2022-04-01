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
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Tabs'}],
    }),
  );
  if (!store.getState().profile.viewedPlan) {
    navigate('Plan');
  }
}

export function resetToLogin() {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Login'}],
    }),
  );
}

export function navigateToLoginIfNecessary() {
  if (
    !navigationRef
      .getState()
      ?.routes.map(route => route.name)
      .includes('Login')
  ) {
    navigate('Login');
  }
}

export function resetToWelcome() {
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
