import {View, Text} from 'react-native';
import React, {RefObject, useState} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import colors from '../../constants/colors';
import moment from 'moment';
import Test from '../../types/Test';
import {PREP_TIME} from '../views/Tests/Test';
import {calculateVO2Max} from '../../helpers/tests';
import Input from './Input';
import Button from './Button';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';

const TestTimer: React.FC<{
  test: Test;
  tabIndex: number;
  testStarted: boolean;
  prepTime: number;
  testTime: number;
  complete: boolean;
  profile: Profile;
  testResult?: number;
  heartRate: number;
  setTestResult: (result: number) => void;
  setHeartRate: (heartRate: number) => void;
}> = ({
  tabIndex,
  test,
  testStarted,
  prepTime,
  testTime,
  complete,
  profile,
  heartRate,
  setHeartRate,
  testResult,
  setTestResult,
}) => {
  const isPrepping = testStarted && prepTime > 0;

  const finished =
    (test.type === 'countup' && complete) ||
    (test.type === 'countdown' && testTime <= 0);

  const getFill = () => {
    if (finished) {
      return 100;
    }

    if (isPrepping) {
      return (100 / PREP_TIME) * prepTime;
    }
    if (test.type === 'countdown' && testTime > 0) {
      return (100 / (test.time || 30)) * testTime;
    }

    return 0;
  };

  const showTimer = !isPrepping && !finished && testStarted;

  return (
    <AnimatedCircularProgress
      style={{
        display: tabIndex === 0 ? 'flex' : 'none',
        alignSelf: 'center',
        transform: [{scaleX: test.type === 'countup' ? 1 : -1}],
        backgroundColor: finished ? colors.appBlue : 'transparent',
        borderRadius: 100,
        marginVertical: 20,
      }}
      size={200}
      width={12}
      backgroundWidth={8}
      fill={getFill()}
      tintColor={
        test.type === 'untimed'
          ? colors.borderColor
          : finished
          ? colors.muscleSecondary
          : colors.appBlue
      }
      // tintColorSecondary={colors.appBlueFaded}
      backgroundColor={colors.borderColor}
      arcSweepAngle={360}
      rotation={0}
      lineCap="round">
      {fill => (
        <View style={{transform: [{scaleX: test.type === 'countup' ? 1 : -1}]}}>
          {showTimer && (
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.appWhite,
                fontSize: 40,
                textAlign: 'center',
              }}>
              {moment()
                .utc()
                .startOf('day')
                .add({seconds: prepTime || testTime})
                .format('mm:ss')}
            </Text>
          )}
          {!showTimer && (
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.appWhite,
                fontSize: isPrepping || finished ? 30 : 16,
                textAlign: 'center',
                paddingHorizontal: 10,
              }}>
              {isPrepping
                ? 'GET READY!'
                : finished
                ? 'FINISHED!'
                : test.type === 'untimed'
                ? 'NOT TIMED'
                : 'PRESS START TO BEGIN'}
            </Text>
          )}
          {complete && (
            <View style={{}}>
              {test.type !== 'countup' ? (
                <Text style={{color: colors.appWhite}}>Enter result</Text>
              ) : test.formula === 'vo2' ? (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.appWhite,
                        marginRight: 10,
                      }}>
                      {'Heart rate'}
                    </Text>
                    <Input
                      value={heartRate?.toString()}
                      onChangeText={val =>
                        setHeartRate(Number(val.replace(/[^0-9]/g, '')))
                      }
                      keyboardType="numeric"
                      style={{width: 100, marginVertical: 5}}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.appWhite,
                      marginTop: 10,
                      marginBottom: 20,
                      fontWeight: 'bold',
                    }}>
                    {`VO2 max = ${calculateVO2Max(
                      profile,
                      testTime,
                      heartRate,
                    )?.toFixed(2)}`}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}>
                  {moment()
                    .utc()
                    .startOf('day')
                    .add({seconds: testTime})
                    .format('mm:ss')}
                </Text>
              )}
              {test.type !== 'countup' && (
                <Input
                  value={testResult?.toString()}
                  onChangeText={val =>
                    setTestResult(Number(val.replace(/[^0-9]/g, '')))
                  }
                  keyboardType="numeric"
                  style={{width: 100, marginVertical: 5}}
                />
              )}
            </View>
          )}
        </View>
      )}
    </AnimatedCircularProgress>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(TestTimer);
