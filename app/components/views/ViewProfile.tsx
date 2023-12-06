import {View, Text} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../App';

const ViewProfile: React.FC<{
  route: RouteProp<StackParamList, 'ViewProfile'>;
}> = ({route}) => {
  const {connection} = route.params;
  return (
    <View>
      <Text>ViewProfile</Text>
    </View>
  );
};

export default ViewProfile;
