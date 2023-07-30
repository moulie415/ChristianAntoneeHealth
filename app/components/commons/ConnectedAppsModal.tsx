import {View, Linking, TouchableOpacity, Dimensions} from 'react-native';
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
import Icon from 'react-native-vector-icons/FontAwesome5';

const ConnectedIcon: React.FC = () => {
  return (
    <View
      style={{
        backgroundColor: colors.appGreen,
        position: 'absolute',
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 10,
      }}>
      <Icon name="check" color={colors.appWhite} />
    </View>
  );
};

const IMAGE_SIZE = Dimensions.get('window').width / 5;

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
          Connect Apps
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${Config.ROOT_API_URL}auth/garmin?uid=${profile.uid}`,
              )
            }>
            <View>
              <FastImageAnimated
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: IMAGE_SIZE / 2,
                }}
                source={require('../../images/garmin.png')}
              />
              {!!profile.garminAccessToken &&
                !!profile.garminAccessTokenSecret && <ConnectedIcon />}
            </View>
            <Text
              style={{
                color: colors.appWhite,
                textAlign: 'center',
                marginTop: 10,
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
            <View>
              <FastImageAnimated
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: IMAGE_SIZE / 2,
                }}
                source={require('../../images/polar.png')}
              />
              {!!profile.polarAccessToken && <ConnectedIcon />}
            </View>
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
            <View>
              <FastImageAnimated
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: IMAGE_SIZE / 2,
                }}
                source={require('../../images/fitbit.png')}
              />
              {!!profile.fitbitToken && !!profile.fitbitRefreshToken && (
                <ConnectedIcon />
              )}
            </View>
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
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button onPress={() => setVisible(false)} text="Close" />
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ConnectedAppsModal);
