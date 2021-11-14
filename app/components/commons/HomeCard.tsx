import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import globalStyles from '../../styles/globalStyles';
import ImageOverlay from './ImageOverlay';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const CARD_MARGIN = DevicePixels[5] * RATIO;

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: ImageSourcePropType;
}> = ({title, subtitle, onPress, image}) => {
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
          overlayAlpha={0.4}
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
            category="h5"
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
        </View>
      </Layout>
    </TouchableHighlight>
  );
};

export default HomeCard;
