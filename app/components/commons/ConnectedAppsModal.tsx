import {View, Linking, TouchableOpacity} from 'react-native';
import React from 'react';
import Button from './Button';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Config from 'react-native-config';
import Profile from '../../types/Profile';
import Modal from './Modal';
import colors from '../../constants/colors';
import FastImageAnimated from './FastImageAnimated';
import Text from './Text';

const IMAGE_SIZE = 75;

const ConnectedAppsModal: React.FC<{
  profile: Profile;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({profile, visible, setVisible}) => {
  return (
    <Modal visible={visible} onRequestClose={() => setVisible(false)}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '90%',
          borderRadius: 10,
          height: '50%',
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Connected Apps
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${Config.ROOT_API_URL}auth/polar?uid=${profile.uid}`,
              )
            }>
            <FastImageAnimated
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: IMAGE_SIZE / 2,
              }}
              source={require('../../images/garmin.png')}
            />
            <Text
              style={{
                color: colors.appWhite,
                textAlign: 'center',
                marginTop: 5,
                fontSize: 16,
              }}>
              {'Garmin\nConnect'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${Config.ROOT_API_URL}auth/polar?uid=${profile.uid}`,
              )
            }>
            <FastImageAnimated
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: IMAGE_SIZE / 2,
              }}
              source={require('../../images/polar.png')}
            />
            <Text
              style={{
                color: colors.appWhite,
                textAlign: 'center',
                marginTop: 10,
                fontSize: 16,
              }}>
              {'Polar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${Config.ROOT_API_URL}auth/fitbit?uid=${profile.uid}`,
              )
            }>
            <FastImageAnimated
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: IMAGE_SIZE / 2,
              }}
              source={require('../../images/fitbit.png')}
            />
            <Text
              style={{
                color: colors.appWhite,
                textAlign: 'center',
                marginTop: 10,
                fontSize: 16,
              }}>
              {'Fitbit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ConnectedAppsModal);
