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
        top: -2,
        right: -2,
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
  uid: string;
  hideCheck?: boolean;
}> = ({src, size, name, uid, hideCheck}) => {
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
        {isAdmin && !hideCheck && <AdminCheck size={size} />}
      </View>
    );
  }
  return (
    <View>
      <UserAvatar size={size || 30} name={name} src={src} />
      {isAdmin && !hideCheck && <AdminCheck size={size} />}
    </View>
  );
};

export default Avatar;
