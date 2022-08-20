import React from 'react';
import FitnessTestingProps from '../../../types/views/FitnessTesting';
import {ScrollView, ImageBackground} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import DevicePixels from '../../../helpers/DevicePixels';
import {SafeAreaView} from 'react-native-safe-area-context';
import TestCard from '../../commons/TestCard';
import FastImage from 'react-native-fast-image';

const FitnessTesting: React.FC<FitnessTestingProps> = ({
  navigation,
  tests,
  profile,
}) => {
  return (
    <FastImage
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
    </FastImage>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(FitnessTesting);
