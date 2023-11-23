import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StackParamList} from './App';
import colors from './constants/colors';
import Home from './components/views/Home';
import FitnessTesting from './components/views/Tests/FitnessTesting';
import Plan from './components/views/Plan/Plan';
import WhatEquipment from './components/views/Workout/WhatEquipment';
import {connect} from 'react-redux';
import {MyRootState} from './types/Shared';
import Profile from './types/Profile';
import Color from 'color';
import PlanTabIcon from './PlanTabIcon';
import Avatar from './components/commons/Avatar';
import ProfileComponent from './components/views/Profile';

const Tab = createBottomTabNavigator<StackParamList>();

const color = new Color(colors.appWhite);

const Tabs: React.FC<{
  profile: Profile;
}> = ({profile}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.appWhite,
        tabBarInactiveTintColor: color.darken(0.4).toString(),
        tabBarStyle: {borderTopWidth: 0, backgroundColor: colors.appGrey},
        lazy: false,
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
        component={WhatEquipment}
      />
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
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Avatar
              name={`${profile.name} ${profile.surname || ''}`}
              src={profile.avatar}
              uid={profile.uid}
              size={28}
            />
          ),
          headerShown: false,
        }}
        key="Profile"
        name="Profile"
        component={ProfileComponent}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Plan',
          tabBarIcon: ({color, size}) => (
            <PlanTabIcon color={color} size={size} />
          ),
          headerShown: false,
        }}
        name="Plan"
        key="Plan"
        component={Plan}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Tabs);
