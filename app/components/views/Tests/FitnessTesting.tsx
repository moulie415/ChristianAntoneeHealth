import React from 'react';
import FitnessTestingProps from '../../../types/views/FitnessTesting';
import {
  TouchableOpacity,
  View,
  ImageSourcePropType,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import DevicePixels from '../../../helpers/DevicePixels';
import {getTestImage} from '../../../helpers/images';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';

const FitnessTesting: React.FC<FitnessTestingProps> = ({
  navigation,
  tests,
  profile,
}) => {
  const items: {
    name: string;
    image: ImageSourcePropType;
    id: string;
    premium: boolean;
  }[] = tests
    ? Object.values(tests).map(({name, id, premium}, index) => {
        return {name, image: getTestImage(index), id, premium};
      })
    : [];

  return (
    <ImageBackground
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={{marginTop: DevicePixels[20]}}>
        <SafeAreaView>
          {items.map(({name, image, id, premium}, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (premium && !profile.premium) {
                    navigation.navigate('Premium');
                  } else {
                    navigation.navigate('Test', {id});
                  }
                }}
                key={name}>
                <ImageBackground
                  style={{
                    height: DevicePixels[140],
                    marginHorizontal: DevicePixels[15],
                    marginBottom: DevicePixels[10],
                  }}
                  borderRadius={DevicePixels[10]}
                  source={image}>
                  <ImageBackground
                    source={require('../../../images/BlackTransparentBackground.png')}
                    blurRadius={3}
                    style={{
                      height: DevicePixels[140],
                      justifyContent: 'center',
                      padding: DevicePixels[10],
                    }}
                    borderRadius={DevicePixels[10]}>
                    {premium && !profile.premium && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          margin: DevicePixels[10],
                        }}>
                        <Icon
                          name="lock"
                          color="#fff"
                          size={DevicePixels[30]}
                        />
                      </View>
                    )}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: DevicePixels[200],
                        margin: DevicePixels[20],
                      }}>
                      <Text
                        style={{
                          color: colors.appWhite,
                          fontSize: DevicePixels[16],
                          fontWeight: 'bold',
                        }}>
                        {name}
                      </Text>
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(FitnessTesting);
