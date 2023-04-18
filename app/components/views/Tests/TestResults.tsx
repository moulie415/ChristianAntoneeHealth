import React, {useEffect} from 'react';
import TestResultsProp from '../../../types/views/TestResults';
import moment from 'moment';
import colors from '../../../constants/colors';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Hyperlink from 'react-native-hyperlink';
import {
  capitalizeFirstLetter,
  getCategoryColor,
  getCategoryString,
  getPercentile,
  getPercentileFill,
  getScoreIcon,
  getTableAverage,
  getTableCategory,
  getTableColumn,
  getTableMax,
} from '../../../helpers';
import {resetToTabs} from '../../../RootNavigation';
import {saveTest} from '../../../actions/tests';
import {Alert, ImageBackground, View} from 'react-native';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThrottle from '../../../hooks/UseThrottle';
import FastImage from 'react-native-fast-image';
import Test, {
  PercentileTable as PercentileTableType,
  Table as TableType,
} from '../../../types/Test';
import Profile from '../../../types/Profile';
import {ScrollView} from 'react-native-gesture-handler';
import Table from '../../commons/Table';
import PercentileTable from '../../commons/PercentileTable';
import {keyHasValue} from '../../../helpers/table';

const getData = (
  test: Test,
  profile: Profile,
  seconds: number,
  testResult?: number,
) => {
  const score = testResult || seconds;
  const age = (profile.dob && moment().diff(profile.dob, 'years')) || 0;
  if (
    test &&
    test.mens &&
    test.womens &&
    'age' in test.mens &&
    'age' in test.womens
  ) {
    const colMens = getTableColumn(test.mens, age);
    const colWomens = getTableColumn(test.womens, age);

    const averageMens = colMens && getTableAverage(test.mens, colMens);
    const averageWomens = colMens && getTableAverage(test.womens, colMens);

    const categoryMens = colMens && getTableCategory(test.mens, colMens, score);
    const categoryWomens =
      colWomens && getTableCategory(test.womens, colWomens, score);

    const maxMens = colMens && getTableMax(test.mens, colMens);

    const maxWomens = colWomens && getTableMax(test.womens, colWomens);

    return {
      colMens,
      colWomens,
      averageMens,
      averageWomens,
      categoryMens,
      categoryWomens,
      maxMens,
      maxWomens,
    };
  }
  if (
    test.mens &&
    test.womens &&
    !('age' in test.mens) &&
    !('age' in test.womens)
  ) {
    const percentileMens = getPercentile(test.mens, score);
    const percentileWomens = getPercentile(test.womens, score);
    return {percentileMens, percentileWomens};
  }
};

const TestResults: React.FC<TestResultsProp> = ({
  route,
  profile,
  saveTestAction,
  navigation,
}) => {
  const {test, testResult, seconds} = route.params;
  // const table = profile.gender === 'male' ? test.mens : test.womens;
  const age = profile.dob && moment().diff(profile.dob, 'years');

  const gender = profile.gender;

  const noGender = !gender;

  const showMens = noGender || gender === 'male';

  const showWomens = noGender || gender === 'female';

  const score = testResult || seconds;

  const save = useThrottle((saved: boolean) => {
    saveTestAction({
      seconds,
      result: testResult || 0,
      createdate: new Date(),
      testId: test.id,
      saved,
    });
  }, 5000);

  useEffect(() => {
    if (profile.premium) {
      Alert.alert(
        'Save test result?',
        'Do you want to save this test result to view later?',
        [
          {
            text: 'No',
            onPress: () => {
              save(false);
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              save(true);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      save(false);
    }
  }, [saveTestAction, test.id, profile.premium, seconds, testResult, save]);

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1, padding: 20}}>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 10,
            color: colors.appWhite,
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          Test complete!
        </Text>

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
        {test.source && (
          <Hyperlink linkStyle={{color: colors.appBlue}}>
            <Text style={{margin: 10, color: colors.appWhite}}>
              {test.source}
            </Text>
          </Hyperlink>
        )}

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            text="Return Home"
            onPress={resetToTabs}
            style={{marginBottom: 10, marginTop: 20}}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const mapStateToProps = (state: MyRootState) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = {
  saveTestAction: saveTest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
