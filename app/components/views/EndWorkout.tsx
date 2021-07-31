import {Button, Input, Layout, Text} from '@ui-kitten/components';
import Slider from '@react-native-community/slider';
import React, {useState} from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';
import {resetToTabs} from '../../RootNavigation';
import {useMemo} from 'react';

const EndWorkout: React.FC = () => {
  const [difficulty, setDifficulty] = useState(1);
  const emoji = useMemo(() => {
    if (difficulty === 0) {
      return '😊';
    }
    if (difficulty === 1) {
      return '😐';
    }
    if (difficulty === 2) {
      return '😰';
    }
    return '🤢';
  }, [difficulty]);

  const {text, subtext} = useMemo(() => {
    if (difficulty === 0) {
      return {text: 'Easy', subtext: 'I could do this all day'};
    }
    if (difficulty === 1) {
      return {
        text: 'Moderate',
        subtext: 'That was uncomfortable, but I can still talk easily',
      };
    }
    if (difficulty === 2) {
      return {text: 'Hard', subtext: "I can't breath or talk, my muscles burn"};
    }
    return {text: 'Very Hard', subtext: 'I might die'};
  }, [difficulty]);
  return (
    <Layout style={{flex: 1}}>
      <Text
        category="h5"
        style={{textAlign: 'center', margin: 10, marginTop: 20}}>
        Workout Complete!
      </Text>
      <Text style={{margin: 10}}>
        Rate your performance to help us understand your fitness level
      </Text>
      <Text style={{fontSize: 100, textAlign: 'center'}}>{emoji}</Text>

      <Slider
        style={{height: 40, flexDirection: 'row', margin: 10}}
        minimumValue={0}
        maximumValue={3}
        step={1}
        value={difficulty}
        onValueChange={setDifficulty}
      />
      <Text
        style={{
          fontWeight: 'bold',
          margin: 10,
          height: 50,
          textAlign: 'center',
        }}>
        {text}
        <Text style={{fontWeight: 'normal'}}>{` - ${subtext}`}</Text>
      </Text>
      <Input
        label="Workout note"
        textStyle={{minHeight: 50}}
        style={{margin: 10, marginTop: 0}}
        multiline
        placeholder="Add details about your workout"
      />
      <Button style={{margin: 10}} onPress={resetToTabs}>
        Save & Continue
      </Button>
    </Layout>
  );
};

export default EndWorkout;
