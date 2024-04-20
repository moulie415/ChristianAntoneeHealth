import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getTests} from '../../../reducers/tests';
import {Profile} from '../../../types/Shared';
import Test from '../../../types/Test';
import Header from '../../commons/Header';
import TestCard from '../../commons/TestCard';

const FitnessTesting: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Fitness'>;
  tests: {[key: string]: Test};
  profile: Profile;
  getTests: () => void;
}> = ({navigation, tests, profile, getTests: getTestsAction}) => {
  const [hasFetched, setHasFetched] = useState(false);
  useFocusEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
    }
    getTestsAction();
  });

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

const mapStateToProps = ({tests, profile}: RootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

const mapDispatchToProps = {
  getTests,
};

export default connect(mapStateToProps, mapDispatchToProps)(FitnessTesting);
