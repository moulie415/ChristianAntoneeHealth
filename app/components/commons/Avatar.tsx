import React from 'react';
import Image from 'react-native-fast-image';
// @ts-ignore
import UserAvatar from 'react-native-user-avatar';
import DevicePixels from '../../helpers/DevicePixels';

const Avatar: React.FC<{
  src?: string;
  size?: number;
  name: string;
}> = ({src, size, name}) => {
  if (src) {
    return (
      <Image
        source={{uri: src}}
        style={{
          width: size || DevicePixels[30],
          height: size || DevicePixels[30],
          borderRadius: size ? size / 2 : DevicePixels[15],
        }}
      />
    );
  }
  return <UserAvatar size={size || DevicePixels[30]} name={name} src={src} />;
};

export default Avatar;
