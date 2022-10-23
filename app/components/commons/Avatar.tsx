import React from 'react';
import {View} from 'react-native';
import Image from 'react-native-fast-image';
// @ts-ignore
import UserAvatar from 'react-native-user-avatar';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
import {MyRootState} from '../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AdminCheck: React.FC<{size: number}> = ({size = DevicePixels[30]}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: -DevicePixels[2],
        right: -DevicePixels[2],
        backgroundColor: colors.appBlue,
        height: size / 2.5,
        width: size / 2.5,
        borderRadius: size / 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon size={size / 5} name="check" color={colors.appWhite} />
    </View>
  );
};

const Avatar: React.FC<{
  src?: string;
  size?: number;
  name: string;
  admins: string[];
  uid: string;
  hideCheck?: boolean;
}> = ({src, size, name, uid, admins, hideCheck}) => {
  const isAdmin = admins.includes(uid);
  if (src) {
    return (
      <View>
        <Image
          source={{uri: src}}
          style={{
            width: size || DevicePixels[30],
            height: size || DevicePixels[30],
            borderRadius: size ? size / 2 : DevicePixels[15],
          }}
        />
        {isAdmin && !hideCheck && <AdminCheck size={size} />}
      </View>
    );
  }
  return (
    <View>
      <UserAvatar size={size || DevicePixels[30]} name={name} src={src} />
      {isAdmin && !hideCheck && <AdminCheck size={size} />}
    </View>
  );
};

const mapStateToProps = ({settings}: MyRootState) => ({
  admins: settings.admins,
});

export default connect(mapStateToProps)(Avatar);
