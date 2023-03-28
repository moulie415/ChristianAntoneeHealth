import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import Test from '../../types/Test';

import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {getTestImage} from '../../helpers/images';
import Text from './Text';
import FastImage from 'react-native-fast-image';

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
  const image = getTestImage(
    Object.values(tests).findIndex(i => i.id === item.id),
  );
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} key={item.name}>
      <FastImage
        style={{
          height: 120,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={image}>
        <View
          style={{
            height: 140,
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          {plan ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="heartbeat"
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
            <>
              {item.premium && !profile.premium && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    margin: 10,
                  }}>
                  <Icon name="lock" color="#fff" size={30} />
                </View>
              )}
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  width: 200,
                  margin: 20,
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
              </View>
            </>
          )}
        </View>
      </FastImage>
    </TouchableOpacity>
  );
};
const mapStateToProps = ({profile, tests}: MyRootState) => ({
  profile: profile.profile,
  tests: tests.tests,
});

export default connect(mapStateToProps)(TestCard);
