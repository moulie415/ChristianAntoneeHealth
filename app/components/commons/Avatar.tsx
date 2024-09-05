import {Avatar as UserAvatar} from '@kolking/react-native-avatar';
import React from 'react';
import {ImageStyle, View} from 'react-native';
import Image, {ImageStyle as FastImageStyle} from 'react-native-fast-image';

import colors from '../../constants/colors';

import Icon from 'react-native-vector-icons/FontAwesome6';
import {useAppSelector} from '../../hooks/redux';

const AdminCheck: React.FC<{size?: number}> = ({size = 30}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: -(size / 7),
        right: -(size / 7),
        backgroundColor: colors.appBlue,
        height: size / 2,
        width: size / 2,
        borderRadius: size / 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon size={size / 3.5} name="shield-halved" color={colors.appWhite} />
    </View>
  );
};

const Avatar: React.FC<{
  src?: string;
  size?: number;
  name: string;
  uid: string;
  hideAdmin?: boolean;
  style?: ImageStyle | FastImageStyle;
}> = ({src, size, name, uid, hideAdmin, style}) => {
  const {admins} = useAppSelector(state => state.settings);
  const isAdmin = admins.includes(uid);
  if (src) {
    return (
      <View>
        <Image
          source={{uri: src}}
          style={[
            {
              width: size || 30,
              height: size || 30,
              borderRadius: size ? size / 2 : 15,
            },
            style as FastImageStyle,
          ]}
        />
        {isAdmin && !hideAdmin && <AdminCheck size={size} />}
      </View>
    );
  }
  return (
    <View>
      <UserAvatar
        size={size || 30}
        name={name}
        colorize
        style={style as ImageStyle}
      />
      {isAdmin && !hideAdmin && <AdminCheck size={size} />}
    </View>
  );
};

export default Avatar;
