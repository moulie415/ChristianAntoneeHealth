import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Color from 'color';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {StackParamList} from './App';
import LeaderboardTabIcon from './LeaderboardTabIcon';
import PlanTabIcon from './PlanTabIcon';
import {navigate} from './RootNavigation';
import Avatar from './components/commons/Avatar';
import Home from './components/views/Home';
import Leaderboards from './components/views/Leaderboards/Leaderboards';
import Plan from './components/views/Plan/Plan';
import ProfileComponent from './components/views/Profile';
import WhatEquipment from './components/views/Workout/WhatEquipment';
import colors from './constants/colors';
import {hasPremiumPlus} from './helpers/hasPremiumPlus';
import {useAppSelector} from './hooks/redux';

const Tab = createBottomTabNavigator<StackParamList>();

const color = new Color(colors.appWhite);

const Tabs: React.FC = () => {
  const {profile} = useAppSelector(state => state.profile);
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
            <Icon
              style={{width: 35, alignSelf: 'center'}}
              color={color}
              size={size}
              name="house"
            />
          ),
          headerShown: false,
        }}
        name="Home"
        key="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Avatar
              name={`${profile.name} ${profile.surname || ''}`}
              src={profile.avatar}
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
          tabBarLabel: 'Workout',
          tabBarIcon: ({color, size}) => (
            <Icon
              style={{width: 35, alignSelf: 'center'}}
              color={color}
              size={size}
              name="dumbbell"
            />
          ),
          headerShown: false,
        }}
        name="Workout"
        key="Workout"
        component={WhatEquipment}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Leaderboards',
          tabBarIcon: ({color, size}) => (
            <LeaderboardTabIcon color={color} size={size} />
          ),
          headerShown: false,
        }}
        key="Leaderboards"
        name="Leaderboards"
        component={Leaderboards}
        listeners={{
          tabPress: e => {
            if (!profile.premium) {
              e.preventDefault();
              navigate('Premium', {});
            }
          },
        }}
      />

      {(profile.client || profile.admin) && (
        <Tab.Screen
          options={{
            tabBarLabel: 'Plan',
            tabBarIcon: ({color, size}) => (
              <PlanTabIcon color={color} size={size} />
            ),
            headerShown: false,
          }}
          listeners={{
            tabPress: e => {
              if (!(profile.admin || hasPremiumPlus(profile.premium))) {
                e.preventDefault();
                navigate('Premium', {});
              }
            },
          }}
          name="Plan"
          key="Plan"
          component={Plan}
        />
      )}
    </Tab.Navigator>
  );
};

export default Tabs;
