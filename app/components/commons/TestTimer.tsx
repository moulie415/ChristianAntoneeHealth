import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import { RootState } from '../../App';
import colors from '../../constants/colors';
import { Profile } from '../../types/Shared';
import Test from '../../types/Test';
import { PREP_TIME } from '../views/Tests/Test';
import Input from './Input';
import Text from './Text';

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
  const isPrepping = testStarted && prepTime > 0 && test.type !== 'untimed';

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

  const showTimer = !finished && testStarted && test.type !== 'untimed';

  const scaleX = test.type === 'countup' && !isPrepping ? 1 : -1;
  return (
    <AnimatedCircularProgress
      style={{
        zIndex: -1,
        display: tabIndex === 0 ? 'flex' : 'none',
        alignSelf: 'center',
        transform: [{ scaleX }],
        backgroundColor: finished ? colors.appBlue : 'transparent',
        borderRadius: 100,
        marginVertical: 10,
      }}
      size={200}
      width={8}
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
      lineCap="round"
    >
      {(fill: number) => (
        <View style={{ transform: [{ scaleX }], alignItems: 'center' }}>
          {showTimer && (
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.appWhite,
                fontSize: 40,
                textAlign: 'center',
              }}
            >
              {moment()
                .utc()
                .startOf('day')
                .add({ seconds: Math.ceil(prepTime || testTime) })
                .format('mm:ss')}
            </Text>
          )}
          {(!showTimer || isPrepping) && (
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.appWhite,
                fontSize: 16,
                textAlign: 'center',
                paddingHorizontal: 10,
              }}
            >
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
                <Text style={{ color: colors.appWhite, textAlign: 'center' }}>
                  Enter result
                </Text>
              ) : test.formula === 'vo2' ? (
                <View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: colors.appWhite,
                      }}
                    >
                      Enter heart rate
                    </Text>
                    <Input
                      value={heartRate?.toString()}
                      onChangeText={val =>
                        setHeartRate(Number(val.replace(/[^0-9]/g, '')))
                      }
                      keyboardType="numeric"
                      style={{ width: 100, marginVertical: 5 }}
                    />
                  </View>
                </View>
              ) : (
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}
                >
                  {moment()
                    .utc()
                    .startOf('day')
                    .add({ seconds: testTime })
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
                  style={{ width: 100, marginVertical: 5 }}
                />
              )}
            </View>
          )}
        </View>
      )}
    </AnimatedCircularProgress>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(TestTimer);
