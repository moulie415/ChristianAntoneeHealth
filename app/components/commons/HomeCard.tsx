import {Text} from '@ui-kitten/components';
import React from 'react';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import globalStyles from '../../styles/globalStyles';
import ImageOverlay from './ImageOverlay';

const HomeCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: () => void;
  image: ImageSourcePropType;
}> = ({title, subtitle, onPress, image}) => {
  return (
    <TouchableOpacity
      style={[{flex: 1, marginHorizontal: 10}, globalStyles.boxShadow]}
      onPress={onPress}>
      <ImageOverlay
        containerStyle={{flex: 1, width: '100%', borderRadius: 10}}
        source={image}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          margin: 5,
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
          category="s1"
          style={[
            globalStyles.textShadow,
            {color: '#fff', textAlign: 'center'},
          ]}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeCard;
