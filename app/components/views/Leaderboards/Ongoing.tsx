import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {useAppSelector} from '../../../hooks/redux';

const Ongoing = () => {
  const {profile} = useAppSelector(state => state.profile);

  useFocusEffect(() => {
    console.log('ongoing focused');
    if (profile.premium && profile.optedInToLeaderboards) {
    }
  });
  return (
    <View>
      <Text>Ongoing</Text>
    </View>
  );
};

export default Ongoing;
