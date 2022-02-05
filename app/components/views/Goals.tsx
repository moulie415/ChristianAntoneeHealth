import React from 'react';
import {TouchableOpacity} from 'react-native';
import GoalsProps from '../../types/views/Goals';
import {
  Select,
  SelectItem,
  Button,
  Input,
  IndexPath,
  Layout,
  Text,
} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {goalItems} from '../../constants';
import DevicePixels from '../../helpers/DevicePixels';

const Goals: React.FC<GoalsProps> = ({goal, setGoal, signUp, loading}) => {
  return (
    <Layout style={{margin: DevicePixels[20]}}>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[10]}}>
        What is your main goal for using this app?
      </Text>
      <Select
        value={goal ? goalItems.find(item => item.goal === goal).title : ' '}
        onSelect={index => {
          if ('row' in index) {
            setGoal(goalItems[index.row].goal);
          }
        }}
        selectedIndex={
          new IndexPath(goalItems.findIndex(item => item.goal === goal))
        }>
        {goalItems.map(item => {
          return (
            <SelectItem
              key={item.goal}
              selected={item.goal === goal}
              title={item.title}
            />
          );
        })}
      </Select>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[20]}}>
        How many times a week do you want to workout?
      </Text>
      <Button disabled={!goal || loading} onPress={signUp}>
        Create Account
      </Button>
    </Layout>
  );
};

export default Goals;
