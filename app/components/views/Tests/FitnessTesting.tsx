import React, {MutableRefObject} from 'react';
import {ScrollView, ImageBackground, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';

import {SafeAreaView} from 'react-native-safe-area-context';
import TestCard from '../../commons/TestCard';
import colors from '../../../constants/colors';
import Header from '../../commons/Header';
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Test from '../../../types/Test';
import Profile from '../../../types/Profile';

const FitnessTesting: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Fitness'>;
  tests: {[key: string]: Test};
  profile: Profile;
}> = ({navigation, tests, profile}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header showDrawerMenuButton />

        <ScrollView
          contentContainerStyle={{
            paddingBottom: 60,
          }}>
          {Object.values(tests)
            .filter(item => !item.disabled)
            .map((item, index) => {
              return (
                <TestCard
                  key={item.id}
                  item={item}
                  onPress={() => {
                    if (item.premium && !profile.premium) {
                      navigation.navigate('Premium', {});
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
