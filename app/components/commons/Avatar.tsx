import React from 'react';
import {View} from 'react-native';
import Image from 'react-native-fast-image';
// @ts-ignore
import UserAvatar from 'react-native-user-avatar';
import colors from '../../constants/colors';

import Icon from 'react-native-vector-icons/FontAwesome6';
import {useAppSelector} from '../../hooks/redux';

const AdminCheck: React.FC<{size?: number}> = ({size = 30}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: -(size / 6),
        right: -(size / 6),
        backgroundColor: colors.appBlue,
        height: size / 1.75,
        width: size / 1.75,
        borderRadius: size / 3.5,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon size={size / 3} name="shield-halved" color={colors.appWhite} />
    </View>
  );
};

const Avatar: React.FC<{
  src?: string;
  size?: number;
  name: string;
  uid: string;
  hideAdmin?: boolean;
}> = ({src, size, name, uid, hideAdmin}) => {
  const {admins} = useAppSelector(state => state.settings);
  const isAdmin = admins.includes(uid);
  if (src) {
    return (
      <View>
        <Image
          source={{uri: src}}
          style={{
            width: size || 30,
            height: size || 30,
            borderRadius: size ? size / 2 : 15,
          }}
        />
        {isAdmin && !hideAdmin && <AdminCheck size={size} />}
      </View>
    );
  }
  return (
    <View>
      <UserAvatar size={size || 30} name={name} src={src} />
      {isAdmin && !hideAdmin && <AdminCheck size={size} />}
    </View>
  );
};

export default Avatar;
