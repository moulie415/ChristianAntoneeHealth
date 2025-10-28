import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../../constants/colors';
import { useAppSelector } from '../../../hooks/redux';
import ImageAnimated from '../../commons/ImageAnimated';
import Text from '../../commons/Text';

const { height } = Dimensions.get('window');

const RecipeCard: React.FC<{
  name: string;
  image: string;
  onPress: () => void;
  premium?: boolean;
}> = ({ onPress, name, image, premium }) => {
  const { profile } = useAppSelector(state => state.profile);
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageAnimated
        style={{
          height: Platform.OS === 'ios' ? height / 5.5 : height / 5,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
          overflow: 'hidden',
        }}
        source={{ uri: image }}
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
              maxWidth: 300,
              padding: 10,
            }}
          >
            {name}
          </Text>
        </LinearGradient>
        {premium && !profile.premium && (
          <View
            style={{
              position: 'absolute',
              bottom: 15,
              right: 15,
            }}
          >
            <FontAwesome6
              iconStyle="solid"
              name="lock"
              color={colors.appWhite}
              size={20}
            />
          </View>
        )}
      </ImageAnimated>
    </TouchableOpacity>
  );
};

export default RecipeCard;
