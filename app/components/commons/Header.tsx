import {TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import BackButton from './BackButton';
import {navigationRef} from '../../RootNavigation';
import DevicePixels from '../../helpers/DevicePixels';
import Text from './Text';
import colors from '../../constants/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {DrawerActions} from '@react-navigation/routers';
import Profile from '../../types/Profile';

const Header: React.FC<{
  hasBack?: boolean;
  title?: string;
  right?: ReactNode;
  absolute?: boolean;
  customBackPress?: () => void;
  showDrawerMenu?: boolean;
}> = ({hasBack, title, right, absolute, customBackPress, showDrawerMenu}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        position: absolute ? 'absolute' : 'relative',
        top: absolute ? insets.top : undefined,
        left: absolute ? 0 : undefined,
        zIndex: 1,
      }}>
      {hasBack && (
        <BackButton
          style={{margin: DevicePixels[20]}}
          onPress={customBackPress || navigationRef?.goBack}
        />
      )}
      {showDrawerMenu && (
        <TouchableOpacity
          onPress={() => navigationRef.dispatch(DrawerActions.openDrawer())}
          style={{margin: DevicePixels[20]}}>
          <Icon
            name="bars"
            color={colors.appWhite}
            size={DevicePixels[25]}
            style={{marginLeft: -DevicePixels[3]}}
          />
        </TouchableOpacity>
      )}

      {!!title && (
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[22],
            fontWeight: 'bold',
          }}>
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
