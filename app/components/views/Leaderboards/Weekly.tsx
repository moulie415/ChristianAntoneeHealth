import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {useAppSelector} from '../../../hooks/redux';

const Weekly = () => {
  const {profile} = useAppSelector(state => state.profile);

  useFocusEffect(() => {
    console.log('weekly focused');
    if (profile.premium && profile.optedInToLeaderboards) {
    }
  });
  return (
    <View>
      <Text>Weekly</Text>
    </View>
  );
};

export default Weekly;
