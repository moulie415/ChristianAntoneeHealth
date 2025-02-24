import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {goBack} from '../../RootNavigation';
import colors from '../../constants/colors';

const ModalExitButton = () => {
  return (
    <TouchableOpacity
      onPress={goBack}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        top: 20,
        right: 20,
        position: 'absolute',
      }}>
      <Icon name="xmark" color={colors.appWhite} size={25} />
    </TouchableOpacity>
  );
};

export default ModalExitButton;
