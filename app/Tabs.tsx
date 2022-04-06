import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StackParamList} from './App';
import colors from './constants/colors';
import Home from './components/views/Home';
import Workout from './components/views/Workout/Workout';
import FitnessTesting from './components/views/Tests/FitnessTesting';
import More from './components/views/More/More';
import MoreIcon from './components/commons/unread/MoreIcon';
import WhatsYourGoal from './components/views/Workout/WhatsYourGoal';
import Plan from './components/views/Plan/Plan';

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
          tabBarLabel: 'Plan',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="calendar-alt" />
          ),
          headerShown: false,
        }}
        name="Plan"
        key="Plan"
        component={Plan}
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
        component={WhatsYourGoal}
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
          tabBarLabel: 'Test',
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
          tabBarIcon: ({color, size}) => <MoreIcon color={color} size={size} />,
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
