import {
  CommonActions,
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';
import * as React from 'react';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: string, params?: ParamListBase) {
  navigationRef.current?.navigate(name, params);
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
