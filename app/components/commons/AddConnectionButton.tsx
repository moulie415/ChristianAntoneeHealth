import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';

const AddConnectionButton: FunctionComponent<{
  navigation: NativeStackNavigationProp<StackParamList>;
}> = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('AddConnection')}>
      <Icon
        color={colors.appWhite}
        size={20}
        style={{padding: 10}}
        name="user-plus"
      />
    </TouchableOpacity>
  );
};

export default AddConnectionButton;
