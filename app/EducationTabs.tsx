import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import General from './components/views/Education/General';
import Exercise from './components/views/Education/Exercise';
import Nutritional from './components/views/Education/Nutritional';

export type EducationTabsParamsList = {
  General: undefined;
  Exercise: undefined;
  Nutritional: undefined;
};

const Tab = createMaterialTopTabNavigator<EducationTabsParamsList>();

const EducationTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="General"
        options={{
          tabBarLabel: 'General Lifestyle',
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={General}
      />
      <Tab.Screen
        name="Exercise"
        options={{
          tabBarLabel: 'Exercise Articles',
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={Exercise}
      />
      <Tab.Screen
        name="Nutritional"
        options={{
          tabBarLabel: 'Nutritional Info',
          tabBarLabelStyle: {textTransform: 'none'},
        }}
        component={Nutritional}
      />
    </Tab.Navigator>
  );
};

export default EducationTabs;
