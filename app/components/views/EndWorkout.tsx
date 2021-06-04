import {Button, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';
import {resetToTabs} from '../../RootNavigation';

const EndWorkout: FunctionComponent = () => {
  const [difficulty, setDifficulty] = useState(1);
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text
        category="h5"
        style={{textAlign: 'center', margin: 10, marginTop: 20}}>
        Workout Complete!
      </Text>
      <Text style={{margin: 10}}>
        Rate your performance to help us understand your fitness level
      </Text>
      <Text style={{margin: 10}}>
        need to have a think about this bit as can't seem find a vertical slider
        component
      </Text>
      <Button style={{margin: 10}} onPress={resetToTabs}>
        Save & Continue
      </Button>
    </View>
  );
};

export default EndWorkout;
