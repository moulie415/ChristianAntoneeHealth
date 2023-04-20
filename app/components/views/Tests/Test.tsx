import Image from 'react-native-fast-image';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import TestProps from '../../../types/views/Test';
import colors from '../../../constants/colors';
import Countdown from '../../commons/Countdown';
import Table from '../../commons/Table';

import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';
import {getVideoHeight} from '../../../helpers';
import PercentileTable from '../../commons/PercentileTable';
import Button from '../../commons/Button';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import Divider from '../../commons/Divider';
import Header from '../../commons/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ViewMore from '../../commons/ViewMore';
import FastImageAnimated from '../../commons/FastImageAnimated';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';

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
  const [seconds, setSeconds] = useState(test.time || 0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [complete, setComplete] = useState(false);
  const [testResult, setTestResult] = useState<number>();
  const [testNote, setTestNote] = useState('');
  const [start, setStart] = useState(0);

  const insets = useSafeAreaInsets();

  const {load, show, isLoaded, isClosed} = useInterstitialAd(
    UNIT_ID_INTERSTITIAL,
    {
      keywords: AD_KEYWORDS,
    },
  );

  useEffect(() => {
    if (settings.ads) {
      load();
    }
  }, [settings.ads, load]);

  useEffect(() => {
    if (isClosed && settings.ads) {
      load();
    }
  }, [isClosed, load, settings.ads]);

  useEffect(() => {
    if (isClosed) {
      if (test.type === 'untimed') {
        setTestStarted(true);
      } else {
        setShowCountdown(true);
      }
    }
  }, [isClosed, navigation, test.type]);

  useEffect(() => {
    if (
      testStarted &&
      !complete &&
      (test.type === 'countdown' || test.type === 'countup')
    ) {
      const startCountdown = moment().unix() + seconds;
      const intervalID = setInterval(() => {
        if (test.type === 'countup') {
          setSeconds(moment().unix() - start);
        } else {
          if (seconds > 0) {
            setSeconds(Math.floor(startCountdown - moment().unix()));
          } else {
            setComplete(true);
          }
        }
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [testStarted, test.type, seconds, complete, start]);

  const getTimeString = () => {
    if (test.type === 'untimed') {
      return 'not timed';
    }
    if (test.type === 'countdown' && !(seconds > 0)) {
      return 'Times up!';
    }
    return moment().utc().startOf('day').add({seconds}).format('mm:ss');
  };

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

  return (
    <View style={{flex: 1}}>
      {showCountdown && (
        <Countdown
          onComplete={() => {
            setTestStarted(true);
            setStart(moment().unix());
          }}
        />
      )}

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
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 10 + insets.top,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Icon name="stopwatch" size={30} color={colors.appWhite} />
          <Text
            style={{
              marginLeft: 10,
              color: colors.appWhite,
              fontSize: 22,
              fontWeight: 'bold',
            }}>
            {getTimeString()}
          </Text>
        </View>
      </View>

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
                <Text style={{color: colors.appWhite}}>
                  Enter result of test below
                </Text>
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
                      .add({seconds})
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
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 16,
                  marginBottom: 10,
                }}>
                See how you rank against others in the same gender and age
                category:
              </Text>
              <Button
                text="GO"
                onPress={() =>
                  navigation.navigate('TestResults', {
                    test,
                    testResult,
                    seconds,
                  })
                }
                style={{marginTop: 10}}
                disabled={!testResult && test.type !== 'countup'}
              />
            </View>
          ) : (
            <>
              {/* <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} /> */}

              <Text
                style={{
                  margin: 10,
                  marginTop: 20,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                }}>
                {test.name}
              </Text>
              <View
                style={{
                  marginBottom: 10,
                }}>
                <ViewMore text={test.summary} lines={7} />
              </View>

              {/* <Divider />
              {test.mens && 'age' in test.mens && (
                <Table
                  table={test.mens}
                  metric={test.metric}
                  title="Mens table"
                />
              )}
              {test.womens && 'age' in test.womens && (
                <Table
                  table={test.womens}
                  metric={test.metric}
                  title="Women's table"
                />
              )}
              {test.mens && '10th' in test.mens && (
                <PercentileTable
                  table={test.mens}
                  title="Mens percentile table"
                />
              )}
              {test.womens && '10th' in test.womens && (
                <PercentileTable
                  table={test.womens}
                  title="Women's percentile table"
                />
              )}
              {test.source && (
                <Text style={{margin: 10, color: colors.appWhite}}>
                  {test.source}
                </Text>
              )} */}
            </>
          )}
          {!(testStarted && test.type === 'countdown') && !complete && (
            <Button
              text={getButtonString()}
              onPress={() => {
                if (testStarted) {
                  setComplete(true);
                } else {
                  if (isLoaded && !profile.premium && settings.ads) {
                    show();
                  } else {
                    if (test.type === 'untimed') {
                      setTestStarted(true);
                      setComplete(true);
                    } else {
                      setShowCountdown(true);
                    }
                  }
                }
              }}
              style={{
                margin: 10,
              }}
            />
          )}
          {testStarted && test.type !== 'untimed' && !complete && (
            <Button
              text="Restart"
              onPress={() => {
                if (test.type === 'countup') {
                  setSeconds(0);
                } else {
                  setSeconds(test.time as number);
                }
              }}
              style={{
                margin: 10,
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
