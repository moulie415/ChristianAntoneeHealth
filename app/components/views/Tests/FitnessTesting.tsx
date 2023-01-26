import React from 'react';
import FitnessTestingProps from '../../../types/views/FitnessTesting';
import {ScrollView, ImageBackground, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import DevicePixels from '../../../helpers/DevicePixels';
import {SafeAreaView} from 'react-native-safe-area-context';
import TestCard from '../../commons/TestCard';
import colors from '../../../constants/colors';
import Header from '../../commons/Header';

const FitnessTesting: React.FC<FitnessTestingProps> = ({
  navigation,
  tests,
  profile,
}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header showDrawerMenu />

        <ScrollView
          contentContainerStyle={{
            paddingBottom: DevicePixels[20],
          }}>
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(FitnessTesting);
