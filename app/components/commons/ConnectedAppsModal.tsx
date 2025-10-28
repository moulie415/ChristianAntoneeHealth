import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Dimensions, Linking, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { RootState } from '../../App';
import colors from '../../constants/colors';
import { Profile } from '../../types/Shared';
import Button from './Button';
import ImageAnimated from './ImageAnimated';
import Modal from './Modal';
import Text from './Text';

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
      }}
    >
      <FontAwesome6 name="check" color={colors.appWhite} iconStyle="solid" />
    </View>
  );
};

const IMAGE_SIZE = Dimensions.get('window').width / 5;

const ConnectedAppsModal: React.FC<{
  profile: Profile;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ profile, visible, setVisible }) => {
  return (
    <Modal visible={visible} onRequestClose={() => setVisible(false)}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '90%',
          borderRadius: 10,
          height: '50%',
          padding: 20,
        }}
      >
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Manage connected apps
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${process.env.EXPO_PUBLIC_ROOT_API_URL}auth/garmin?uid=${profile.uid}`,
              )
            }
          >
            <View>
              <ImageAnimated
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
              }}
            >
              {'Garmin\nConnect'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${process.env.EXPO_PUBLIC_ROOT_API_URL}auth/polar?uid=${profile.uid}`,
              )
            }
          >
            <View>
              <ImageAnimated
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
              }}
            >
              {'Polar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `${process.env.EXPO_PUBLIC_ROOT_API_URL}auth/fitbit?uid=${profile.uid}`,
              )
            }
          >
            <View>
              <ImageAnimated
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
              }}
            >
              {'Fitbit'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button onPress={() => setVisible(false)} text="Close" />
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ConnectedAppsModal);
