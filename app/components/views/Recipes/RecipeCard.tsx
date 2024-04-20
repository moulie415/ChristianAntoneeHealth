import React from 'react';
import {Dimensions, Platform, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import colors from '../../../constants/colors';
import {Profile} from '../../../types/Shared';
import FastImageAnimated from '../../commons/FastImageAnimated';
import Text from '../../commons/Text';

const {height} = Dimensions.get('window');

const RecipeCard: React.FC<{
  name: string;
  image: string;
  onPress: () => void;
  premium: boolean;
  profile: Profile;
}> = ({onPress, name, image, profile, premium}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <FastImageAnimated
        style={{
          height: Platform.OS === 'ios' ? height / 5.5 : height / 5,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={{uri: image}}>
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            height: 75,
            justifyContent: 'flex-end',
            padding: 10,
            borderRadius: 10,
            right: 0,
            left: 0,
            bottom: 0,
            position: 'absolute',
            alignSelf: 'flex-end',
            marginBottom: -1,
          }}>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {name}
          </Text>
        </LinearGradient>
        {premium && !profile.premium && (
          <View
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
            }}>
            <Icon name="lock" color={colors.appWhite} size={20} />
          </View>
        )}
      </FastImageAnimated>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(RecipeCard);
