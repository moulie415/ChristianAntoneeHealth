import {View} from 'react-native';
import React, {ReactNode} from 'react';
import BackButton from './BackButton';
import {navigationRef} from '../../RootNavigation';
import DevicePixels from '../../helpers/DevicePixels';
import Text from './Text';
import colors from '../../constants/colors';

const Header: React.FC<{
  hasBack?: boolean;
  title?: string;
  right?: ReactNode;
}> = ({hasBack, title, right}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {hasBack && (
        <BackButton
          style={{margin: DevicePixels[20]}}
          onPress={navigationRef?.goBack}
        />
      )}
      {!!title && (
        <Text style={{color: colors.appWhite, fontSize: DevicePixels[20]}}>
          {title}
        </Text>
      )}
      {!!right && (
        <View
          style={{flex: 1, alignItems: 'flex-end', margin: DevicePixels[20]}}>
          {right}
        </View>
      )}
    </View>
  );
};

export default Header;
