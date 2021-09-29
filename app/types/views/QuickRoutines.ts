import {CompositeNavigationProp} from '@react-navigation/core';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList, TopTabsParamsList} from '../../App';

type QuickRoutinesNavigationProp = StackNavigationProp<
  StackParamList,
  'QuickRoutines'
>;

export default interface QuickRoutinesProps {
  navigation: QuickRoutinesNavigationProp;
  getQuickRoutinesAction: () => void;
}
