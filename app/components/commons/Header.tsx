import {TouchableOpacity, View} from 'react-native';
import React, {MutableRefObject, ReactNode} from 'react';
import BackButton from './BackButton';
import {navigationRef} from '../../RootNavigation';
import DevicePixels from '../../helpers/DevicePixels';
import Text from './Text';
import colors from '../../constants/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer';

const Header: React.FC<{
  hasBack?: boolean;
  title?: string;
  right?: ReactNode;
  absolute?: boolean;
  customBackPress?: () => void;
  profile: Profile;
  drawerRef?: MutableRefObject<Drawer>;
}> = ({
  hasBack,
  title,
  right,
  absolute,
  customBackPress,
  profile,
  drawerRef,
}) => {
  const insets = useSafeAreaInsets();
  const count = Object.values(profile.unread || {}).reduce(
    (acc, cur) => acc + cur,
    0,
  );
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
      {drawerRef?.current && (
        <TouchableOpacity
          onPress={() => drawerRef.current?.open()}
          style={{margin: DevicePixels[20]}}>
          <Icon
            name="bars"
            color={colors.appWhite}
            size={DevicePixels[25]}
            style={{marginLeft: -DevicePixels[3]}}
          />
          {profile.premium && count > 0 && (
            <View
              style={{
                width: DevicePixels[20],
                height: DevicePixels[20],
                borderRadius: DevicePixels[10],
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                top: -DevicePixels[5],
                right: -DevicePixels[8],
                backgroundColor: colors.appRed,
              }}>
              <Text
                style={{
                  fontSize: DevicePixels[12],
                  fontWeight: 'bold',
                  color: colors.appWhite,
                }}>
                {count > 9 ? '9+' : count}
              </Text>
            </View>
          )}
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

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Header);
