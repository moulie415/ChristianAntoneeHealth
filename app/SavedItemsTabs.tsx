import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SavedWorkouts from './components/views/SavedItems/SavedWorkouts';
import SavedTests from './components/views/SavedItems/SavedTests';
import SavedQuickRoutines from './components/views/SavedItems/SavedQuickRoutines';

export type SavedItemsParamsList = {
  SavedWorkouts: undefined;
  SavedTests: undefined;
  SavedQuickRoutines: undefined;
};

const SavedItemsTab = createMaterialTopTabNavigator<SavedItemsParamsList>();

const SavedItemsTabs = () => {
  return (
    <SavedItemsTab.Navigator>
      <SavedItemsTab.Screen
        name="SavedWorkouts"
        options={{
          tabBarLabel: 'Saved workouts',
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={SavedWorkouts}
      />
      <SavedItemsTab.Screen
        name="SavedTests"
        options={{
          tabBarLabel: 'Saved tests',
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={SavedTests}
      />
      <SavedItemsTab.Screen
        name="SavedQuickRoutines"
        options={{
          tabBarLabel: 'Saved quick routines',
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={SavedQuickRoutines}
      />
    </SavedItemsTab.Navigator>
  );
};

export default SavedItemsTabs;
