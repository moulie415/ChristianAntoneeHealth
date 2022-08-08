import React from 'react';
import {
  ImageSourcePropType,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import DevicePixels from '../../helpers/DevicePixels';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import Text from './Text';

const {height, width} = Dimensions.get('window');

const CARD_HEIGHT = DevicePixels[125];

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: ImageSourcePropType;
  premium?: boolean;
  profile: Profile;
}> = ({title, subtitle, onPress, image, profile, premium}) => {
  return (
    <TouchableOpacity
      style={{
        height: CARD_HEIGHT,
        marginHorizontal: DevicePixels[20],
        marginBottom: DevicePixels[15],
        borderRadius: DevicePixels[10],
        overflow: 'hidden',
      }}
      onPress={onPress}>
      <Image
        style={{
          position: 'absolute',
          height: CARD_HEIGHT,
          width: '100%',
        }}
        source={image}
      />

      <ImageBackground
        source={require('../../images/BlackTransparentBackground.png')}
        blurRadius={3}
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          right: 0,
          top: 0,
          bottom: 0,
          width: width / 2,
          padding: DevicePixels[10],
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[18],
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
        <Text style={{color: colors.appWhite}}>{subtitle}</Text>
        {premium && !profile.premium && (
          <Icon
            style={{marginTop: DevicePixels[10], alignSelf: 'flex-end'}}
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
