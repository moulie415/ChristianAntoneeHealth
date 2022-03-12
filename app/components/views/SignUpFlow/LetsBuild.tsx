import {View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';

const LetsBuild: React.FC = () => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          marginBottom: DevicePixels[10],
          marginTop: DevicePixels[40],
        }}>
        Let's build your workout plan
      </Text>
      <Text style={{color: colors.appWhite}}>
        (Swipe from right to continue)
      </Text>
    </View>
  );
};

export default LetsBuild;
