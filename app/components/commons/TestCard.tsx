import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import Test from '../../types/Test';
import DevicePixels from '../../helpers/DevicePixels';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {getTestImage} from '../../helpers/images';
import Text from './Text';
import FastImage from 'react-native-fast-image';

const TestCard: React.FC<{
  item: Test;
  onPress: () => void;
  profile: Profile;
  tests: {[key: string]: Test};
  disabled?: boolean;
}> = ({item, onPress, profile, tests, disabled}) => {
  if (!item) {
    return null;
  }
  const image = getTestImage(
    Object.values(tests).findIndex(i => i.id === item.id),
  );
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} key={item.name}>
      <FastImage
        style={{
          height: DevicePixels[140],
          marginHorizontal: DevicePixels[15],
          marginBottom: DevicePixels[10],
          borderRadius: DevicePixels[10],
        }}
        source={image}>
        <FastImage
          source={require('../../images/BlackTransparentBackground.png')}
          blurRadius={3}
          style={{
            height: DevicePixels[140],
            justifyContent: 'center',
            padding: DevicePixels[10],
            borderRadius: DevicePixels[10],
          }}>
          {item.premium && !profile.premium && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                margin: DevicePixels[10],
              }}>
              <Icon name="lock" color="#fff" size={DevicePixels[30]} />
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: DevicePixels[200],
              margin: DevicePixels[20],
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
              }}>
              {item.name}
            </Text>
          </View>
        </FastImage>
      </FastImage>
    </TouchableOpacity>
  );
};
const mapStateToProps = ({profile, tests}: MyRootState) => ({
  profile: profile.profile,
  tests: tests.tests,
});

export default connect(mapStateToProps)(TestCard);
