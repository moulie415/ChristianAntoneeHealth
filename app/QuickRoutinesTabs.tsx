import React from 'react';
import {RouteProp} from '@react-navigation/core';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {quickRoutineTabString} from './helpers';
import Tab1 from './components/views/QuickRoutines/Tab1';
import Tab2 from './components/views/QuickRoutines/Tab2';
import Tab3 from './components/views/QuickRoutines/Tab3';
import Tab4 from './components/views/QuickRoutines/Tab4';

export type TopTabsParamsList = {
  Tab1: {key: 'area' | 'focus' | 'equipment'};
  Tab2: {key: 'area' | 'focus' | 'equipment'};
  Tab3: {key: 'area' | 'focus' | 'equipment'};
  Tab4: {key: 'area' | 'focus' | 'equipment'};
};

const QuickRoutineTab = createMaterialTopTabNavigator<TopTabsParamsList>();

const QuickRoutinesTabs: React.FC<{route: RouteProp<TopTabsParamsList>}> = ({
  route,
}) => {
  const key: 'area' | 'focus' | 'equipment' = route.params.key;
  return (
    <QuickRoutineTab.Navigator>
      <QuickRoutineTab.Screen
        name="Tab1"
        options={{
          tabBarLabel: quickRoutineTabString(1, key),
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={Tab1}
        initialParams={route.params}
      />
      <QuickRoutineTab.Screen
        name="Tab2"
        options={{
          tabBarLabel: quickRoutineTabString(2, key),
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={Tab2}
        initialParams={route.params}
      />
      <QuickRoutineTab.Screen
        name="Tab3"
        options={{
          tabBarLabel: quickRoutineTabString(3, key),
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={Tab3}
        initialParams={route.params}
      />
      {key === 'area' && (
        <QuickRoutineTab.Screen
          name="Tab4"
          options={{
            tabBarLabel: quickRoutineTabString(4, key),
            tabBarLabelStyle: {textTransform: 'none'},
          }}
          component={Tab4}
          initialParams={route.params}
        />
      )}
    </QuickRoutineTab.Navigator>
  );
};

export default QuickRoutinesTabs;
