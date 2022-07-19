import React from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import DevicePixels from '../../helpers/DevicePixels';
import globalStyles from '../../styles/globalStyles';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import ImageOverlay from './ImageOverlay';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import Text from './Text';
import Image, {Source} from 'react-native-fast-image';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const CARD_MARGIN = DevicePixels[5] * RATIO;

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: Source;
  premium?: boolean;
  profile: Profile;
}> = ({title, subtitle, onPress, image, profile, premium}) => {
  return (
    <TouchableOpacity
      style={[
        {
          height: DevicePixels[150],
          marginHorizontal: CARD_MARGIN,
          borderRadius: DevicePixels[15],
          overflow: 'hidden',
        },
      ]}
      onPress={onPress}>
      <Image
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: DevicePixels[15],
        }}
        source={image}
      />

      <ImageBackground
        source={require('../../images/BlackTransparentBackground.png')}
        resizeMode="cover"
        blurRadius={10}
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          right: 0,
          top: 0,
          bottom: 0,
          width: width / 2,
        }}>
        <Text style={[{color: '#fff', textAlign: 'center'}]}>{title}</Text>
        <Text
          style={[
            {
              color: '#fff',
              opacity: 0.7,
              textAlign: 'center',
            },
          ]}>
          {subtitle}
        </Text>
        {premium && !profile.premium && (
          <Icon
            style={{marginTop: DevicePixels[10]}}
            name="lock"
            size={DevicePixels[20]}
            color={colors.appWhite}
          />
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(HomeCard);
