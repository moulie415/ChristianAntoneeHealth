import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import TestResultsProp from '../../../types/views/TestResults';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import moment from 'moment';
import colors from '../../../constants/colors';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
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
import Test, {PercentileTable, Table} from '../../../types/Test';
import Profile from '../../../types/Profile';
import { ScrollView } from 'react-native-gesture-handler';

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

  const score = testResult || seconds;

  const isTable = test.mens && 'age' in test.mens;

  const data = getData(test, profile, seconds, testResult);

  const [fillMens, setFillMens] = useState(
    isTable && data && 'maxMens' in data
      ? (100 / (data.maxMens || 0)) * score
      : getPercentileFill(data?.percentileMens),
  );

  const [fillWomens, setFillWomens] = useState(
    isTable && data && 'maxWomens' in data
      ? (100 / (data.maxWomens || 0)) * score
      : getPercentileFill(data?.percentileWomens),
  );

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

        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: 30,
            fontSize: 20,
          }}>
          Mens
        </Text>
        <AnimatedCircularProgress
          style={{alignSelf: 'center', marginTop: 20}}
          size={120}
          width={15}
          backgroundWidth={5}
          fill={fillMens}
          tintColor={getCategoryColor(
            (data?.categoryMens || data?.percentileMens) as string,
          )}
          // tintColorSecondary={colors.appBlueFaded}
          backgroundColor={colors.appWhite}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round">
          {fill => (
            <Text
              style={{
                fontSize: 30,
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              {score}
            </Text>
          )}
        </AnimatedCircularProgress>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {!data?.percentileMens && (
            <>
              {getScoreIcon(
                (data?.categoryMens || data?.percentileMens) as string,
              ) === '-' ? (
                <Text
                  style={{
                    fontSize: 30,
                    marginRight: 10,
                    color: colors.appWhite,
                  }}>
                  -
                </Text>
              ) : (
                <Icon
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                    color: colors.appWhite,
                  }}
                  name={getScoreIcon(
                    (data?.categoryMens || data?.percentileMens) as string,
                  )}
                />
              )}
            </>
          )}
          <Text style={{color: colors.appWhite}}>
            {isTable
              ? `${getCategoryString(data?.categoryMens)} score`
              : `${capitalizeFirstLetter(
                  data?.percentileMens as string,
                )} percentile`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 20,
          }}>
          <Icon
            style={{
              fontSize: 20,
              marginHorizontal: 10,
              color: colors.appWhite,
            }}
            name="tachometer-alt"
          />
          <Text
            style={{
              fontSize: 16,
              flex: 1,
              color: colors.appWhite,
            }}>
            {isTable ? 'You score is ' : 'You scored in the '}
            <Text style={{fontWeight: 'bold'}}>
              {isTable
                ? getCategoryString(data?.categoryMens)
                : `${data?.percentileMens}`}
            </Text>
            {isTable ? ` for men of your age (${age}). ` : ' percentile '}
            {data?.averageMens ? (
              <Text>{`The average for men of your age is between ${data?.averageMens.lower} and ${data?.averageMens.higher}`}</Text>
            ) : (
              <Text>
                {data?.percentileMens === 'bottom'
                  ? ''
                  : `This means you scored higher than ${data?.percentileMens}% of men`}
              </Text>
            )}
          </Text>
        </View>

        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: 30,
            fontSize: 20,
          }}>
          Womens
        </Text>
        <AnimatedCircularProgress
          style={{alignSelf: 'center', marginTop: 20}}
          size={120}
          width={15}
          backgroundWidth={5}
          fill={fillWomens}
          tintColor={getCategoryColor(
            (data?.categoryWomens || data?.percentileWomens) as string,
          )}
          // tintColorSecondary={colors.appBlueFaded}
          backgroundColor={colors.appWhite}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round">
          {fill => (
            <Text
              style={{
                fontSize: 30,
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              {score}
            </Text>
          )}
        </AnimatedCircularProgress>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {!data?.percentileWomens && (
            <>
              {getScoreIcon(
                (data?.categoryWomens || data?.percentileWomens) as string,
              ) === '-' ? (
                <Text
                  style={{
                    fontSize: 30,
                    marginRight: 10,
                    color: colors.appWhite,
                  }}>
                  -
                </Text>
              ) : (
                <Icon
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                    color: colors.appWhite,
                  }}
                  name={getScoreIcon(
                    (data?.categoryWomens || data?.percentileWomens) as string,
                  )}
                />
              )}
            </>
          )}
          <Text style={{color: colors.appWhite}}>
            {isTable
              ? `${getCategoryString(data?.categoryWomens)} score`
              : `${capitalizeFirstLetter(
                  data?.percentileWomens as string,
                )} percentile`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 20,
          }}>
          <Icon
            style={{
              fontSize: 20,
              marginHorizontal: 10,
              color: colors.appWhite,
            }}
            name="tachometer-alt"
          />
          <Text
            style={{
              fontSize: 16,
              flex: 1,
              color: colors.appWhite,
            }}>
            {isTable ? 'You score is ' : 'You scored in the '}
            <Text style={{fontWeight: 'bold'}}>
              {isTable
                ? getCategoryString(data?.categoryWomens)
                : `${data?.percentileWomens}`}
            </Text>
            {isTable ? ` for women of your age (${age}). ` : ' percentile '}
            {data?.averageWomens ? (
              <Text>{`The average for women your age is between ${data?.averageWomens.lower} and ${data?.averageWomens.higher}`}</Text>
            ) : (
              <Text>
                {data?.percentileWomens === 'bottom'
                  ? ''
                  : `This means you scored higher than ${data?.percentileWomens}% of women`}
              </Text>
            )}
          </Text>
        </View>

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
