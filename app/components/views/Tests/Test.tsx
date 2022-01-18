import {Button, Divider, Input, Layout, Text} from '@ui-kitten/components';
import Image from 'react-native-fast-image';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {ScrollView, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import TestProps from '../../../types/views/Test';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {SAMPLE_VIDEO_LINK} from '../../../constants/strings';
import colors from '../../../constants/colors';
import Countdown from '../../commons/Countdown';
import ViewMore from '../../commons/ViewMore';
import Table from '../../commons/Table';
import DevicePixels from '../../../helpers/DevicePixels';
import {useInterstitialAd} from '@react-native-admob/admob';
import {UNIT_ID_INTERSTITIAL} from '../../../constants';
import globalStyles from '../../../styles/globalStyles';
import {getTestImage} from '../../../helpers/images';
import ImageLoader from '../../commons/ImageLoader';
import {getVideoHeight} from '../../../helpers';
import PercentileTable from '../../commons/PercentileTable';

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

  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);

  useEffect(() => {
    if (adDismissed) {
      if (test.type === 'untimed') {
        setTestStarted(true);
      } else {
        setShowCountdown(true);
      }
    }
  }, [adDismissed, navigation, test.type]);

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
    <Layout style={{flex: 1}}>
      {showCountdown && (
        <Countdown
          onComplete={() => {
            setTestStarted(true);
            setStart(moment().unix());
          }}
        />
      )}
      <Layout
        style={{
          flexDirection: 'row',
          margin: DevicePixels[10],
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Layout
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
          <Text style={{marginLeft: DevicePixels[10]}} category="h5">
            {getTimeString()}
          </Text>
        </Layout>
      </Layout>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        {complete ? (
          <Layout style={{margin: 20}}>
            <Text category="h5" style={{textAlign: 'center', marginBottom: 10}}>
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
              style={{marginVertical: 5}}
              textStyle={{minHeight: DevicePixels[50]}}
              multiline
            />
            <Button
              onPress={() =>
                navigation.navigate('TestResults', {
                  test,
                  testResult,
                  seconds,
                  testNote,
                })
              }
              style={{marginTop: 10}}
              disabled={!testResult && test.type !== 'countup'}>
              See results
            </Button>
          </Layout>
        ) : (
          <>
            {/* <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} /> */}
            <Image
              source={getTestImage(test.name)}
              style={{height: getVideoHeight()}}
            />
            <Text category="h6" style={{margin: DevicePixels[10]}}>
              {test.name}
            </Text>
            <Text
              style={{
                marginHorizontal: DevicePixels[10],
              }}>
              {test.summary}
            </Text>
            <Carousel
              vertical={false}
              data={test.how}
              sliderWidth={width}
              itemWidth={width - DevicePixels[75]}
              renderItem={({item, index}) => {
                return (
                  <Layout
                    style={{
                      marginVertical: DevicePixels[20],
                      borderRadius: DevicePixels[10],
                      ...globalStyles.boxShadow,
                    }}>
                    <Layout
                      style={{
                        borderRadius: DevicePixels[10],
                        backgroundColor: '#fff',
                        height: DevicePixels[300],
                        padding: DevicePixels[20],
                      }}>
                      <Text style={{lineHeight: DevicePixels[20]}}>{item}</Text>
                    </Layout>
                  </Layout>
                );
              }}
            />

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
                  title="Womens table"
                />
              )}
            {test.mens &&
              '10th' in test.mens &&
              (profile.gender === 'male' || !profile.gender) && (
                <PercentileTable table={test.mens} />
              )}
            {test.womens &&
              '10th' in test.womens &&
              (profile.gender === 'female' || !profile.gender) && (
                <PercentileTable table={test.womens} />
              )}
          </>
        )}
        {!(testStarted && test.type === 'countdown') && !complete && (
          <Button
            onPress={() => {
              if (testStarted) {
                setComplete(true);
              } else {
                if (adLoaded && !profile.premium && settings.ads) {
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
            }}>
            {testStarted ? 'End' : 'Start'}
          </Button>
        )}
      </ScrollView>
    </Layout>
  );
};

const mapStateToProps = ({tests, profile, settings}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
  settings,
});

export default connect(mapStateToProps)(Test);
