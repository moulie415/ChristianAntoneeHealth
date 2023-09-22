import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Alert, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import TestProps from '../../../types/views/Test';
import colors from '../../../constants/colors';
import {getVideoHeight} from '../../../helpers';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import Header from '../../commons/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ViewMore from '../../commons/ViewMore';
import FastImageAnimated from '../../commons/FastImageAnimated';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import {calculateVO2Max} from '../../../helpers/tests';
import MyTabs from '../../commons/MyTabs';
import TestTimer from '../../commons/TestTimer';
import useInterval from '../../../hooks/UseInterval';

export const PREP_TIME = 5;

const Test: React.FC<TestProps> = ({
  route,
  tests,
  profile,
  navigation,
  settings,
}) => {
  const {id} = route.params;
  const test = tests[id];
  const [testStarted, setTestStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [testResult, setTestResult] = useState<number>();
  const [heartRate, setHeartRate] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const [prepTime, setPrepTime] = useState(PREP_TIME);

  const [testTime, setTestTime] = useState(
    test.type === 'countdown' ? test.time || 0 : 0,
  );

  useInterval(() => {
    if (testStarted && test.type !== 'untimed') {
      if (prepTime > 0) {
        setPrepTime(prepTime - 1);
      } else {
        if (test.type === 'countup') {
          setTestTime(testTime + 1);
        } else if (testTime > 0) {
          setTestTime(testTime - 1);
        }
      }
    }
  }, 1000);

  const getButtonString = () => {
    if (test.type === 'untimed') {
      return 'Record result';
    }
    if (testStarted) {
      return 'End';
    } else {
      return 'Start';
    }
  };

  const tabs = ['Test', 'Instructions'];

  return (
    <View style={{flex: 1}}>
      {test.video?.src ? (
        <Video
          source={{uri: convertToProxyURL(test.video?.src)}}
          style={{height: getVideoHeight(), width: '100%'}}
          resizeMode={'cover'}
          repeat
          disableFocus
        />
      ) : (
        <FastImageAnimated
          source={{uri: test.thumbnail.src}}
          style={{
            height: getVideoHeight(),
          }}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#000',
              opacity: 0.4,
            }}
          />
        </FastImageAnimated>
      )}
      <Header hasBack absolute />

      <View
        style={{
          paddingBottom: 220,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: colors.appGrey,
          top: -30,
        }}>
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps="always"
          extraScrollHeight={75}
          contentContainerStyle={{paddingBottom: 220}}>
          {complete ? (
            <View style={{margin: 20}}>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 10,
                  color: colors.appWhite,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Test complete!
              </Text>
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
                    fontSize: 20,
                    marginBottom: 10,
                    color: colors.appWhite,
                  }}>
                  Your result:{' '}
                  <Text style={{fontWeight: 'bold', fontSize: 20}}>
                    {moment()
                      .utc()
                      .startOf('day')
                      .add({seconds: testTime})
                      .format('mm:ss')}
                  </Text>
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
              <Button
                text="Compare your results"
                onPress={() => {
                  if (test.formula === 'vo2') {
                    navigation.navigate('TestResults', {
                      test,
                      testResult:
                        calculateVO2Max(profile, testTime, heartRate) || 0,
                      seconds: testTime,
                    });
                  } else {
                    navigation.navigate('TestResults', {
                      test,
                      testResult,
                      seconds: testTime,
                    });
                  }
                }}
                style={{marginTop: 10}}
                disabled={!testResult && test.type !== 'countup'}
              />
            </View>
          ) : (
            <>
              {/* <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} /> */}

              <Text
                style={{
                  marginTop: 20,
                  color: colors.appWhite,
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {test.name}
              </Text>
              <MyTabs
                tabs={tabs}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
              />
              <TestTimer
                testStarted={testStarted}
                tabIndex={tabIndex}
                test={test}
                prepTime={prepTime}
                testTime={testTime}
                complete={complete}
              />
              {tabIndex === 1 && (
                <View
                  style={{
                    marginHorizontal: 20,
                    marginVertical: 10,
                  }}>
                  <ViewMore
                    textAlign="justify"
                    text={test.summary || ''}
                    lines={9}
                  />
                </View>
              )}
            </>
          )}
          {!(testStarted && test.type === 'countdown') && !complete && (
            <Button
              text={getButtonString()}
              onPress={() => {
                if (
                  test.formula === 'vo2' &&
                  (!profile.dob || !profile.weight || !profile.gender)
                ) {
                  return Alert.alert(
                    'Sorry',
                    "To calculate your VO2 max, you need to make sure you've set your age, weight and sex",
                  );
                }
                if (testStarted) {
                  setComplete(true);
                } else {
                  setTestStarted(true);
                  if (test.type === 'untimed') {
                    setComplete(true);
                  }
                }
              }}
              style={{
                margin: 10,
                marginHorizontal: 20,
              }}
            />
          )}
          {testStarted && test.type !== 'untimed' && !complete && (
            <Button
              text="Restart"
              onPress={() => {
                if (test.type === 'countup') {
                  setTestTime(0);
                } else {
                  setTestTime(test.time as number);
                }
              }}
              style={{
                margin: 10,
                marginHorizontal: 20,
              }}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = ({tests, profile, settings}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
  settings,
});

export default connect(mapStateToProps)(Test);
