import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const Occupation: React.FC<{
  occupation: string;
  setOccupation: (occupation: string) => void;
}> = () => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        Occupation?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <Input
          placeholder="e.g. Doctor, lawyer..."
          textStyle={{height: DevicePixels[100], textAlignVertical: 'top'}}
          multiline
        />
      </View>
    </View>
  );
};

export default Occupation;
