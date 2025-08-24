import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {goBack} from '../../RootNavigation';
import colors from '../../constants/colors';

const ModalExitButton = () => {
  return (
    <SafeAreaView
      style={{
        top: 20,
        right: 20,
        position: 'absolute',
      }}>
      <TouchableOpacity
        onPress={goBack}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FontAwesome6
          iconStyle="solid"
          name="xmark"
          color={colors.appWhite}
          size={25}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModalExitButton;
