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
import {Alert, ImageBackground, View} from 'react-native';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThrottle from '../../../hooks/UseThrottle';
import FastImage from 'react-native-fast-image';

const TestResults: React.FC<TestResultsProp> = ({
  route,
  profile,
  saveTestAction,
  navigation,
}) => {
  const {test, testResult, seconds} = route.params;
  const table = profile.gender === 'male' ? test.mens : test.womens;
  const isTable = 'age' in table;
  const age = profile.dob && moment().diff(profile.dob, 'years');
  const col = isTable && getTableColumn(table, age);
  const score = testResult || seconds;
  const category = isTable && col && getTableCategory(table, col, score);
  const max = isTable && col && getTableMax(table, col);
  const average = isTable && getTableAverage(table, col);
  const percentile = !isTable && getPercentile(table, score);

  const [fill, setFill] = useState(
    isTable ? (100 / max) * score : getPercentileFill(percentile),
  );

  const save = useThrottle((saved: boolean) => {
    saveTestAction({
      seconds,
      result: testResult,
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
  }, [saveTestAction, test.id, profile.premium, seconds, testResult]);

  if (!category) {
    return (
      <View style={{flex: 1, padding: 20}}>
        <Text style={{textAlign: 'center', marginBottom: DevicePixels[10]}}>
          Sorry, your age is out of the range to see the results for this test,
          please make sure you've set your age correctly on your profile
        </Text>
      </View>
    );
  }

  return (
    <FastImage
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, padding: 20}}>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: DevicePixels[10],
            color: colors.appWhite,
            fontWeight: 'bold',
            fontSize: DevicePixels[20],
          }}>
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
          backgroundColor={colors.appWhite}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round">
          {fill => (
            <Text
              style={{
                fontSize: DevicePixels[30],
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
          {!percentile && (
            <>
              {getScoreIcon(category || percentile) === '-' ? (
                <Text
                  style={{
                    fontSize: DevicePixels[30],
                    marginRight: DevicePixels[10],
                    color: colors.appWhite,
                  }}>
                  -
                </Text>
              ) : (
                <Icon
                  style={{
                    fontSize: DevicePixels[20],
                    marginRight: DevicePixels[10],
                    color: colors.appWhite,
                  }}
                  name={getScoreIcon(category || percentile)}
                />
              )}
            </>
          )}
          <Text style={{color: colors.appWhite}}>
            {isTable
              ? `${getCategoryString(category)} score`
              : `${capitalizeFirstLetter(percentile)} percentile`}
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
            style={{fontSize: 20, marginHorizontal: 10, color: colors.appWhite}}
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
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            text="Return Home"
            onPress={resetToTabs}
            style={{marginBottom: DevicePixels[10]}}
          />
        </View>
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = (state: MyRootState) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = {
  saveTestAction: saveTest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
