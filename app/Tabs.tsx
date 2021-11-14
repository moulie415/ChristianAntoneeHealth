import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StackParamList} from './App';
import colors from './constants/colors';
import Home from './components/views/Home';
import Workout from './components/views/Workout/Workout';
import FitnessTesting from './components/views/Tests/FitnessTesting';
import More from './components/views/More/More';

const Tab = createBottomTabNavigator<StackParamList>();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.appBlue,
        tabBarInactiveTintColor: '#7c7c7c',
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="home" />
          ),
          headerShown: false,
        }}
        name="Home"
        key="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Workout',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="dumbbell" />
          ),
          headerShown: false,
        }}
        name="Workout"
        key="Workout"
        component={Workout}
      />
      {/* <Tab.Screen
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="chart-line" />
          ),
        }}
        key="Activity"
        name="Activity"
        component={Activity}
      /> */}
      <Tab.Screen
        options={{
          tabBarLabel: 'Fitness',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="heartbeat" />
          ),
          headerShown: false,
        }}
        key="Fitness"
        name="Fitness"
        component={FitnessTesting}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="ellipsis-h" />
          ),
          headerShown: false,
        }}
        key="More"
        name="More"
        component={More}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
