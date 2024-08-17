import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {useAppSelector} from '../../../hooks/redux';

const Daily = () => {
  const {profile} = useAppSelector(state => state.profile);

  useFocusEffect(() => {
    console.log('daily focused');
    if (profile.premium && profile.optedInToLeaderboards) {
    }
  });
  return (
    <View>
      <Text>Daily</Text>
    </View>
  );
};

export default Daily;
