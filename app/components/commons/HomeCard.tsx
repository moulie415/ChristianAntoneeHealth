import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import {Source} from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {RootState} from '../../App';
import colors from '../../constants/colors';
import {Profile} from '../../types/Shared';
import FastImageAnimated from './FastImageAnimated';
import Text from './Text';

const {height, width} = Dimensions.get('window');

const CARD_HEIGHT = 125;

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: Source | number;
  premium?: boolean;
  profile: Profile;
  delay?: number;
}> = ({title, subtitle, onPress, image, profile, premium, delay}) => {
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
        delay={delay}
        duration={1000}
        style={{
          position: 'absolute',
          height: CARD_HEIGHT,
          width: '100%',
        }}
        source={image}>
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
              <FontAwesome6 iconStyle="solid" name="lock" size={20} color={colors.appWhite} />
            </View>
          )}
        </LinearGradient>
      </FastImageAnimated>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(HomeCard);
