import {View, TouchableOpacity, Dimensions, Platform} from 'react-native';
import React from 'react';
import Test from '../../types/Test';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import Text from './Text';
import FastImage from 'react-native-fast-image';
import FastImageAnimated from './FastImageAnimated';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

const TestCard: React.FC<{
  item: Test;
  onPress: () => void;
  profile: Profile;
  tests: {[key: string]: Test};
  disabled?: boolean;
  plan?: boolean;
}> = ({item, onPress, profile, tests, disabled, plan}) => {
  if (!item) {
    return null;
  }

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} key={item.name}>
      <FastImageAnimated
        style={{
          height: Platform.OS === 'ios' ? height / 5.5 : height / 5,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={{uri: item.thumbnail?.src}}>
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            height: plan ? 100 : 75,
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
          {plan ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="heart-pulse"
                color={colors.appWhite}
                size={30}
                style={{marginHorizontal: 10}}
              />
              <View>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 25,
                    fontWeight: 'bold',
                  }}>
                  Test
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    marginTop: 5,
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
              </View>
            </View>
          ) : (
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {item.name}
            </Text>
          )}
        </LinearGradient>
        {item.premium && !profile.premium && (
          <View
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
            }}>
            <Icon name="lock" color="#fff" size={20} />
          </View>
        )}
      </FastImageAnimated>
    </TouchableOpacity>
  );
};
const mapStateToProps = ({profile, tests}: MyRootState) => ({
  profile: profile.profile,
  tests: tests.tests,
});

export default connect(mapStateToProps)(TestCard);
