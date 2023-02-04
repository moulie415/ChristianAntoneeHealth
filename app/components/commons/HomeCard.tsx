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
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import Text from './Text';
import FastImage, {Source} from 'react-native-fast-image';

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
      <FastImage
        style={{
          position: 'absolute',
          height: CARD_HEIGHT,
          width: '100%',
        }}
        source={image}
      />

      <View
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          right: 0,
          top: 0,
          bottom: 0,
          width: width / 2,
          padding: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
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
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(HomeCard);
