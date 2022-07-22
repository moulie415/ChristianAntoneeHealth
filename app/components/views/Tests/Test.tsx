import Image from 'react-native-fast-image';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {ScrollView, Dimensions, View} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import TestProps from '../../../types/views/Test';
import colors from '../../../constants/colors';
import Countdown from '../../commons/Countdown';
import Table from '../../commons/Table';
import DevicePixels from '../../../helpers/DevicePixels';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';
import {getTestImage} from '../../../helpers/images';
import {getVideoHeight} from '../../../helpers';
import PercentileTable from '../../commons/PercentileTable';
import Button from '../../commons/Button';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import Divider from '../../commons/Divider';

const {width, height} = Dimensions.get('screen');

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
      <View
        style={{
          flexDirection: 'row',
          margin: DevicePixels[10],
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Icon
            name="stopwatch"
            size={DevicePixels[25]}
            color={colors.darkBlue}
          />
          <Text style={{marginLeft: DevicePixels[10]}}>{getTimeString()}</Text>
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        {complete ? (
          <View style={{margin: 20}}>
            <Text style={{textAlign: 'center', marginBottom: 10}}>
              Test complete!
            </Text>
            {test.type !== 'countup' ? (
              <Text>Enter result of test below</Text>
            ) : (
              <Text style={{fontSize: 20, marginBottom: 10}}>
                Your result:{' '}
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
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
            <Text>Test note</Text>
            <Input
              value={testNote}
              onChangeText={setTestNote}
              style={{minHeight: DevicePixels[50]}}
              multiline
            />
            <Button
              text="See results"
              onPress={() =>
                navigation.navigate('TestResults', {
                  test,
                  testResult,
                  seconds,
                  testNote,
                })
              }
              style={{marginTop: 10}}
              disabled={!testResult && test.type !== 'countup'}
            />
          </View>
        ) : (
          <>
            {/* <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} /> */}
            <Image
              source={getTestImage(test.name)}
              style={{height: getVideoHeight()}}
            />
            <Text style={{margin: DevicePixels[10]}}>{test.name}</Text>
            <View
              style={{
                marginHorizontal: DevicePixels[10],
                marginBottom: DevicePixels[10],
              }}>
              {test.how?.map(h => {
                return (
                  <Text style={{}} key={h}>
                    {h}
                  </Text>
                );
              })}
            </View>

            <Divider />
            {test.mens &&
              'age' in test.mens &&
              (profile.gender === 'male' || !profile.gender) && (
                <Table
                  table={test.mens}
                  metric={test.metric}
                  title="Mens table"
                />
              )}
            {test.womens &&
              'age' in test.womens &&
              (profile.gender === 'female' || !profile.gender) && (
                <Table
                  table={test.womens}
                  metric={test.metric}
                  title="Women's table"
                />
              )}
            {test.mens &&
              '10th' in test.mens &&
              (profile.gender === 'male' || !profile.gender) && (
                <PercentileTable
                  table={test.mens}
                  title="Mens percentile table"
                />
              )}
            {test.womens &&
              '10th' in test.womens &&
              (profile.gender === 'female' || !profile.gender) && (
                <PercentileTable
                  table={test.womens}
                  title="Women's percentile table"
                />
              )}
            {test.source && (
              <Text style={{margin: DevicePixels[10]}}>{test.source}</Text>
            )}
          </>
        )}
        {!(testStarted && test.type === 'countdown') && !complete && (
          <Button
            text={testStarted ? 'End' : 'Start'}
            onPress={() => {
              if (testStarted) {
                setComplete(true);
              } else {
                if (isLoaded && !profile.premium && settings.ads) {
                  show();
                } else {
                  if (test.type === 'untimed') {
                    setTestStarted(true);
                  } else {
                    setShowCountdown(true);
                  }
                }
              }
            }}
            style={{
              margin: DevicePixels[10],
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = ({tests, profile, settings}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
  settings,
});

export default connect(mapStateToProps)(Test);
