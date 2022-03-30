import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const Medications: React.FC<{
  medications: string;
  setMedications: (medications: string) => void;
}> = ({medications, setMedications}) => {
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
        Medications?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <Input
          placeholder="List relevant medications... (optional)"
          textStyle={{height: DevicePixels[100], textAlignVertical: 'top'}}
          multiline
          onChangeText={setMedications}
          value={medications}
        />
      </View>
    </View>
  );
};

export default Medications;
