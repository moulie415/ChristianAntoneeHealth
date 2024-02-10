import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Color from 'color';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from './App';
import PlanTabIcon from './PlanTabIcon';
import Avatar from './components/commons/Avatar';
import Home from './components/views/Home';
import Plan from './components/views/Plan/Plan';
import ProfileComponent from './components/views/Profile';
import FitnessTesting from './components/views/Tests/FitnessTesting';
import WhatEquipment from './components/views/Workout/WhatEquipment';
import colors from './constants/colors';
import {hasPremiumPlus} from './helpers/hasPremiumPlus';
import Profile from './types/Profile';
import {MyRootState} from './types/Shared';

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
            <Icon color={color} size={size} name="house" />
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
            <Icon color={color} size={size} name="heart-pulse" />
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
      {profile.admin ||
        (hasPremiumPlus(profile.premium) && (
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
        ))}
    </Tab.Navigator>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Tabs);
