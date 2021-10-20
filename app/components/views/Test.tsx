import {Button, Divider, Input, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import TestProps from '../../types/views/Test';
import ExerciseVideo from '../commons/ExerciseVideo';
import {SAMPLE_VIDEO_LINK} from '../../constants/strings';
import colors from '../../constants/colors';
import Countdown from '../commons/Countdown';
import ViewMore from '../commons/ViewMore';
import Table from '../commons/Table';
import DevicePixels from '../../helpers/DevicePixels';

const Test: React.FC<TestProps> = ({route, tests, profile, navigation}) => {
  const {id} = route.params;
  const test = tests[id];
  const [testStarted, setTestStarted] = useState(false);
  const [seconds, setSeconds] = useState(test.time || 0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [complete, setComplete] = useState(false);
  const [testResult, setTestResult] = useState<number>();
  const [testNote, setTestNote] = useState('');

  useEffect(() => {
    if (
      testStarted &&
      !complete &&
      (test.type === 'countdown' || test.type === 'countup')
    ) {
      const start = moment().unix();
      const startCountdown = moment().unix() + seconds;
      const intervalID = setInterval(() => {
        if (test.type === 'countup') {
          setSeconds(Math.floor(moment().unix() - start));
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
  }, [testStarted, test.type, seconds, complete]);

  return (
    <Layout style={{flex: 1}}>
      {showCountdown && <Countdown onComplete={() => setTestStarted(true)} />}
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
            {test.type === 'untimed'
              ? 'not timed'
              : moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </Layout>
      </Layout>
      <ScrollView contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        {complete ? (
          <Layout style={{margin: 20}}>
            <Text category="h5" style={{textAlign: 'center', marginBottom: 10}}>
              Test complete!
            </Text>
            <Text>Enter result of test below</Text>
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
            <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} />
            <Text category="h6" style={{marginHorizontal: DevicePixels[10]}}>
              {test.name}
            </Text>
            <Text style={{margin: DevicePixels[10]}}>{test.summary}</Text>
            <Divider />
            <Text style={{margin: DevicePixels[10]}} category="s1">
              How to perform this test
            </Text>
            <ViewMore text={test.how.map(step => `• ${step} \n\n`).join('')} />
            <Divider />
            <Text style={{margin: DevicePixels[10]}} category="s1">
              Why is this test important
            </Text>
            <ViewMore text={test.why} />
            <Divider />
            {test.mens && (profile.gender === 'male' || !profile.gender) && (
              <Table
                table={test.mens}
                metric={test.metric}
                title="Mens table"
              />
            )}
            {test.womens &&
              (profile.gender === 'female' || !profile.gender) && (
                <Table
                  table={test.womens}
                  metric={test.metric}
                  title="Womens table"
                />
              )}
          </>
        )}
      </ScrollView>
      {!(testStarted && test.type === 'countdown') && !complete && (
        <Button
          onPress={() => {
            if (testStarted) {
              setComplete(true);
            } else {
              if (test.type === 'untimed') {
                setTestStarted(true);
              } else {
                setShowCountdown(true);
              }
            }
          }}
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          {testStarted ? 'End' : 'Start'}
        </Button>
      )}
    </Layout>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(Test);
