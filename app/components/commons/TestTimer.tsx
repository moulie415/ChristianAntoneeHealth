import {View, Text} from 'react-native';
import React, {RefObject, useState} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import colors from '../../constants/colors';
import moment from 'moment';
import Test from '../../types/Test';
import {PREP_TIME} from '../views/Tests/Test';

const TestTimer: React.FC<{
  test: Test;
  tabIndex: number;
  testStarted: boolean;
  prepTime: number;
  testTime: number;
  complete: boolean;
}> = ({tabIndex, test, testStarted, prepTime, testTime, complete}) => {
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
          {/* {!hideTimer && !finished && exercise.weight && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon color={colors.appWhite} size={15} name="dumbbell" />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  fontSize: 16,
                  textAlign: 'center',
                  marginLeft: 5,
                }}>
                {exercise.weight}
              </Text>
            </View>
          )} */}
          {!isPrepping && !finished && testStarted && (
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
        </View>
      )}
    </AnimatedCircularProgress>
  );
};

export default TestTimer;
