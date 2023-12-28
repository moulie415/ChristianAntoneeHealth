import React from 'react';
import {
  ImageSourcePropType,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  View,
  ImageURISource,
} from 'react-native';
import {connect} from 'react-redux';

import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../constants/colors';
import Text from './Text';
import FastImage, {Source} from 'react-native-fast-image';
import FastImageAnimated from './FastImageAnimated';
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

const CARD_HEIGHT = 125;

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: Source | number;
  premium?: boolean;
  profile: Profile;
}> = ({title, subtitle, onPress, image, profile, premium}) => {
  return (
    <TouchableOpacity
      style={{
        height: CARD_HEIGHT,
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
      }}
      onPress={onPress}>
      <FastImageAnimated
        style={{
          position: 'absolute',
          height: CARD_HEIGHT,
          width: '100%',
        }}
        source={image}
      />

      <LinearGradient
        colors={[
          'rgba(54, 57, 68,0)',
          'rgba(54, 57, 68,0.8)',
          'rgb(54, 57, 68)',
        ]}
        // start={{x: 0, y: 0}}
        // end={{x: 1, y: 0}}
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          right: 0,
          left: 0,
          bottom: -1,
          width: width,
          padding: 10,
          height: 100,
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: colors.appWhite, flex: 3}}>{subtitle}</Text>
        </View>
        {premium && !profile.premium && (
          <View
            style={{
              position: 'absolute',
              bottom: 15,
              right: 15,
            }}>
            <Icon name="lock" size={20} color={colors.appWhite} />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(HomeCard);
