import React, {useState, useEffect} from 'react';
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
import {TourGuideZone} from 'rn-tourguide';
import GoalSummaries from './components/commons/GoalSummaries';

const Tab = createBottomTabNavigator<StackParamList>();

const color = new Color(colors.appWhite);

const Tabs: React.FC<{
  profile: Profile;
  plansEnabled: boolean;
}> = ({profile, plansEnabled}) => {
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
            <TourGuideZone
              zone={0}
              text="Welcome to CA Health, you can start a workout from here"
              borderRadius={16}>
              <Icon color={color} size={size} name="dumbbell" />
            </TourGuideZone>
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
            <TourGuideZone
              zone={1}
              text="Test your fitness from our list of tests here"
              borderRadius={16}>
              <Icon color={color} size={size} name="heartbeat" />
            </TourGuideZone>
          ),
          headerShown: false,
        }}
        key="Fitness"
        name="Fitness"
        component={FitnessTesting}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Goals',
          tabBarIcon: ({color, size}) => (
            <TourGuideZone
              zone={2}
              text="View your weekly goals from here"
              borderRadius={16}>
              <Icon color={color} size={size} name="bullseye" />
            </TourGuideZone>
          ),
          headerShown: false,
        }}
        key="Goals"
        name="Goals"
        component={GoalSummaries}
      />
      {(profile.admin || plansEnabled) && (
        <Tab.Screen
          options={{
            tabBarLabel: 'Plan',
            tabBarIcon: ({color, size}) => (
              <TourGuideZone
                zone={3}
                text="Access your customized plans here"
                borderRadius={16}>
                <Icon color={color} size={size} name="calendar-alt" />
              </TourGuideZone>
            ),
            headerShown: false,
          }}
          name="Plan"
          key="Plan"
          component={Plan}
        />
      )}
    </Tab.Navigator>
  );
};

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  profile: profile.profile,
  plansEnabled: settings.plansEnabled,
});

export default connect(mapStateToProps)(Tabs);
