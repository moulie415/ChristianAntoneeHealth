import {View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const PhysicalInjuries: React.FC<{
  injuries: string;
  setInjuries: (injuries: string) => void;
}> = ({injuries, setInjuries}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appBlue,
        }}>
        Physical injuries?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <Input
          placeholder="e.g. acute or chronic conditions"
          textStyle={{height: DevicePixels[100], textAlignVertical: 'top'}}
          multiline
          onChangeText={setInjuries}
          value={injuries}
        />
      </View>
    </View>
  );
};

export default PhysicalInjuries;
