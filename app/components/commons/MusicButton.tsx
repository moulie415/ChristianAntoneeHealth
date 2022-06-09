import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../styles/globalStyles';

const MusicButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMenu(true)}
        style={{
          position: 'absolute',
          top: DevicePixels[20],
          right: DevicePixels[20],
          height: DevicePixels[50],
          width: DevicePixels[50],
          borderRadius: DevicePixels[25],
          backgroundColor: colors.appBlue,
          alignItems: 'center',
          justifyContent: 'center',
          ...globalStyles.boxShadow,
        }}>
        <Icon name="music" color={colors.appWhite} size={DevicePixels[20]} />
      </TouchableOpacity>
      {showMenu && (
        <View
          style={{
            backgroundColor: colors.appWhite,
            top: 0,
            right: 0,
            left: 0,
            position: 'absolute',
            height: DevicePixels[150],
            borderBottomLeftRadius: DevicePixels[20],
            borderBottomRightRadius: DevicePixels[20],
            ...globalStyles.boxShadow,
          }}
        />
      )}
    </>
  );
};

export default MusicButton;
