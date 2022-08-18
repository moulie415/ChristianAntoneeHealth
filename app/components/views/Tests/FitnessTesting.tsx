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
import TestCard from '../../commons/TestCard';

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
      <ScrollView
        contentContainerStyle={{
          marginTop: DevicePixels[20],
          paddingBottom: DevicePixels[20],
        }}>
        <SafeAreaView>
          {Object.values(tests).map((item, index) => {
            return (
              <TestCard
                key={item.id}
                item={item}
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium');
                  } else {
                    navigation.navigate('Test', {id: item.id});
                  }
                }}
              />
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
