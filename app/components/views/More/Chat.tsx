import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text} from 'react-native';
import {StackParamList} from '../../../App';

const Chat: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  route: RouteProp<StackParamList, 'Chat'>;
}> = ({route}) => {
  const {uid} = route.params;
  return (
    <View>
      <Text />
    </View>
  );
};

export default Chat;
