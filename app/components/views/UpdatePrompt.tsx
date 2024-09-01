import React from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {goBack} from '../../RootNavigation';
import {STORE_LINK} from '../../constants';
import colors from '../../constants/colors';
import {useAppSelector} from '../../hooks/redux';
import Button from '../commons/Button';

const UpdatePrompt = () => {
  const {forceUpdate} = useAppSelector(state => state.settings);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      {!forceUpdate && (
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
      )}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.borderColor,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            style={{position: 'absolute'}}
            name="rotate"
            color={colors.appBlue}
            solid
            size={50}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            margin: 20,
            fontSize: 25,
            fontWeight: 'bold',
            color: colors.appWhite,
          }}>
          Update available
        </Text>

        <Text
          style={{
            color: colors.offWhite,
            fontSize: 12,
            lineHeight: 20,
            textAlign: 'center',
            marginHorizontal: 20,
            width: 275,
          }}>
          Please update to the latest version of CA Health
        </Text>
      </View>
      <Button
        onPress={() => Linking.openURL(STORE_LINK)}
        style={{margin: 20}}
        text="Update Now"
      />
    </SafeAreaView>
  );
};

export default UpdatePrompt;
