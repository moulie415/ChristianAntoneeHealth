import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import DevicePixels from '../../helpers/DevicePixels';
import globalStyles from '../../styles/globalStyles';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import ImageOverlay from './ImageOverlay';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const CARD_MARGIN = DevicePixels[5] * RATIO;

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: ImageSourcePropType;
  premium?: boolean;
  profile: Profile;
}> = ({title, subtitle, onPress, image, profile, premium}) => {
  return (
    <TouchableHighlight
      style={[
        {
          flex: 1,
          marginHorizontal: CARD_MARGIN,
          borderRadius: DevicePixels[25],
        },
        globalStyles.boxShadow,
      ]}
      onPress={onPress}>
      <Layout style={{flex: 1, borderRadius: DevicePixels[25]}}>
        <ImageOverlay
          overlayAlpha={0.5}
          containerStyle={{
            flex: 1,
            width: '100%',
            borderRadius: DevicePixels[25],
          }}
          source={image}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
            padding: DevicePixels[5],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            category="h6"
            style={[
              globalStyles.textShadow,
              {color: '#fff', textAlign: 'center'},
            ]}>
            {title}
          </Text>
          <Text
            category="s2"
            style={[
              globalStyles.textShadow,
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
        </View>
      </Layout>
    </TouchableHighlight>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(HomeCard);
