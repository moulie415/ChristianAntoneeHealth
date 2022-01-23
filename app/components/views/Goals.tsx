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
import {purposeItems} from '../../constants';
import DevicePixels from '../../helpers/DevicePixels';

const Goals: React.FC<GoalsProps> = ({
  workoutFrequency,
  setWorkoutFrequency,
  purpose,
  setPurpose,
  signUp,
  loading,
}) => {
  return (
    <Layout style={{margin: DevicePixels[20]}}>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[10]}}>
        What is your main purpose for using this app?
      </Text>
      <Select
        value={
          purpose
            ? purposeItems.find(item => item.purpose === purpose).title
            : ' '
        }
        onSelect={index => {
          if ('row' in index) {
            setPurpose(purposeItems[index.row].purpose);
          }
        }}
        selectedIndex={
          new IndexPath(
            purposeItems.findIndex(item => item.purpose === purpose),
          )
        }>
        {purposeItems.map(item => {
          return (
            <SelectItem
              key={item.purpose}
              selected={item.purpose === purpose}
              title={item.title}
            />
          );
        })}
      </Select>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[20]}}>
        How many times a week do you want to workout?
      </Text>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: DevicePixels[10],
        }}>
        <TouchableOpacity
          onPress={() => {
            if (workoutFrequency > 1) {
              setWorkoutFrequency(workoutFrequency - 1);
            }
          }}>
          <Icon name="minus" color={colors.appBlue} size={DevicePixels[25]} />
        </TouchableOpacity>
        <Input
          style={{marginHorizontal: DevicePixels[10], width: DevicePixels[70]}}
          textAlign="center"
          keyboardType="numeric"
          returnKeyType="done"
          value={workoutFrequency.toString()}
          onChangeText={text => {
            if (!isNaN(Number(text))) {
              setWorkoutFrequency(Number(text.replace(/[^0-9]/g, '')));
            }
            if (!text) {
              setWorkoutFrequency(1);
            }
          }}
        />
        <TouchableOpacity
          onPress={() => setWorkoutFrequency(workoutFrequency + 1)}>
          <Icon name="plus" color={colors.appBlue} size={DevicePixels[25]} />
        </TouchableOpacity>
      </Layout>
      <Button disabled={!purpose || loading} onPress={signUp}>
        Create Account
      </Button>
    </Layout>
  );
};

export default Goals;
