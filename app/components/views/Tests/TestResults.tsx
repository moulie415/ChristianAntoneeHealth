import {Button, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DevicePixels from '../../../helpers/DevicePixels';
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
import {Alert} from 'react-native';

const TestResults: React.FC<TestResultsProp> = ({
  route,
  profile,
  saveTestAction,
  navigation,
}) => {
  const {test, testResult, testNote, seconds} = route.params;
  const table = profile.gender === 'male' ? test.mens : test.womens;
  const isTable = 'age' in table;
  const age = profile.dob && moment().diff(profile.dob, 'years');
  const col = isTable && getTableColumn(table, age);
  const score = testResult || seconds;
  const category = isTable && getTableCategory(table, col, score);
  const max = isTable && getTableMax(table, col);
  const average = isTable && getTableAverage(table, col);
  const percentile = !isTable && getPercentile(table, score);

  const [fill, setFill] = useState(
    isTable ? (100 / max) * score : getPercentileFill(percentile),
  );

  useEffect(() => {
    const save = (saved?: boolean) => {
      saveTestAction({
        seconds,
        result: testResult,
        createddate: moment().unix(),
        testId: test.id,
        saved,
      });
    };
    if (profile.premium) {
      Alert.alert(
        'Save test result?',
        'Do you want to save this test result to view later?',
        [
          {
            text: 'No',
            onPress: () => {
              save();
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
      save();
    }
  }, [saveTestAction, test.id, profile.premium, seconds, testResult]);

  return (
    <Layout style={{flex: 1, padding: 20}}>
      <Text
        category="h4"
        style={{textAlign: 'center', marginBottom: DevicePixels[10]}}>
        Test complete!
      </Text>

      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={DevicePixels[120]}
        width={DevicePixels[15]}
        backgroundWidth={DevicePixels[5]}
        fill={fill}
        tintColor={getCategoryColor(category || percentile)}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.appGrey}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => <Text category="h4">{score}</Text>}
      </AnimatedCircularProgress>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {!percentile && (
          <>
            {getScoreIcon(category || percentile) === '-' ? (
              <Text
                style={{
                  fontSize: DevicePixels[30],
                  marginRight: DevicePixels[10],
                }}>
                -
              </Text>
            ) : (
              <Icon
                style={{
                  fontSize: DevicePixels[20],
                  marginRight: DevicePixels[10],
                }}
                name={getScoreIcon(category || percentile)}
              />
            )}
          </>
        )}
        <Text category="h5">
          {isTable
            ? `${getCategoryString(category)} score`
            : `${capitalizeFirstLetter(percentile)} percentile`}
        </Text>
      </Layout>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 20,
        }}>
        <Icon
          style={{fontSize: 20, marginHorizontal: 10}}
          name="tachometer-alt"
        />
        <Text
          style={{
            fontSize: 16,
            flex: 1,
          }}>
          {isTable ? 'You score is ' : 'You scored in the '}
          <Text style={{fontWeight: 'bold'}}>
            {isTable ? getCategoryString(category) : `${percentile}`}
          </Text>
          {isTable
            ? ` for your age (${age}) and gender! `
            : ' percentile for your gender'}
          {average ? (
            <Text>{`The average for your age and gender is between ${average.lower} and ${average.higher}`}</Text>
          ) : (
            <Text>
              {percentile === 'bottom'
                ? ''
                : `This means you scored higher than ${percentile}% of people for your gender`}
            </Text>
          )}
        </Text>
      </Layout>

      <Layout style={{flex: 1, justifyContent: 'flex-end'}}>
        <Button onPress={resetToTabs} style={{marginBottom: DevicePixels[10]}}>
          Return Home
        </Button>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state: MyRootState) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = {
  saveTestAction: saveTest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
