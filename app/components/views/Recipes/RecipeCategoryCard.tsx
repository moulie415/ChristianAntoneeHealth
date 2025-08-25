import React from 'react';
import {
  Dimensions,
  ImageSourcePropType,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../constants/colors';
import ImageAnimated from '../../commons/ImageAnimated';
import Text from '../../commons/Text';

const { height } = Dimensions.get('window');

const RecipeCategoryCard: React.FC<{
  name: string;
  image: ImageSourcePropType;
  onPress: () => void;
}> = ({ onPress, name, image }) => {
  return (
    <TouchableOpacity onPress={onPress} key={name}>
      <ImageAnimated
        style={{
          height: Platform.OS === 'ios' ? height / 5.5 : height / 5,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
          overflow: 'hidden',
        }}
        source={image}
      >
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            height: 75,
            justifyContent: 'flex-end',
            borderRadius: 10,
            right: 0,
            left: 0,
            bottom: 0,
            position: 'absolute',
            alignSelf: 'flex-end',
            marginBottom: -1,
          }}
        >
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 20,
              fontWeight: 'bold',
              padding: 10,
            }}
          >
            {name}
          </Text>
        </LinearGradient>
      </ImageAnimated>
    </TouchableOpacity>
  );
};

export default RecipeCategoryCard;
