import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {keyHasValue} from '../../../helpers/table';
import {Profile} from '../../../types/Shared';
import Header from '../../commons/Header';
import PercentileTable from '../../commons/PercentileTable';
import Table from '../../commons/Table';
import TestResultText from './TestResultText';

const TestResults: React.FC<{
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'TestResults'>;
  route: RouteProp<StackParamList, 'TestResults'>;
}> = ({profile, route}) => {
  const {testResult, seconds, test} = route.params;

  const gender = profile.gender;

  const noGender = !gender;

  const showMens = gender === 'male';

  const showWomens = gender === 'female';

  const score = testResult || seconds;

  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack title="Compare result" />

      <View>
        {showMens &&
          test.mens &&
          'age' in test.mens &&
          keyHasValue(test.mens, 'age') && (
            <Table
              score={score}
              table={test.mens}
              metric={test.metric}
              title="Mens table"
            />
          )}
        {showWomens &&
          test.womens &&
          'age' in test.womens &&
          keyHasValue(test.womens, 'age') && (
            <Table
              score={score}
              table={test.womens}
              metric={test.metric}
              title="Women's table"
            />
          )}
        {showMens && test.mens && '10th' in test.mens && test.mens['10th'] && (
          <PercentileTable
            score={score}
            table={test.mens}
            title="Mens percentile table"
          />
        )}
        {showWomens &&
          test.womens &&
          '10th' in test.womens &&
          test.womens['10th'] && (
            <PercentileTable
              score={score}
              table={test.womens}
              title="Women's percentile table"
            />
          )}

        {!noGender && test.mens && test.womens && (
          <TestResultText
            table={showMens ? test.mens : test.womens}
            score={score}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootState) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToProps)(TestResults);
