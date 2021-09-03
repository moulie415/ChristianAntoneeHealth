import {Button, Divider, Layout, Text} from '@ui-kitten/components';
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

const Test: React.FC<TestProps> = ({route, tests, profile}) => {
  const {id} = route.params;
  const test = tests[id];
  const [testStarted, setTestStarted] = useState(false);
  const [seconds, setSeconds] = useState(test.time || 0);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (testStarted && (test.type === 'countdown' || test.type === 'countup')) {
      const start = moment().unix();
      const startCountdown = moment().unix() + seconds;
      const intervalID = setInterval(() => {
        if (test.type === 'countup') {
          setSeconds(Math.floor(moment().unix() - start));
        } else {
          if (seconds > 0) {
            setSeconds(Math.floor(startCountdown - moment().unix()));
          }
        }
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [testStarted, test.type, seconds]);

  return (
    <Layout style={{flex: 1}}>
      {showCountdown && <Countdown onComplete={() => setTestStarted(true)} />}
      <Layout
        style={{
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Layout
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Icon name="stopwatch" size={25} color={colors.darkBlue} />
          <Text style={{marginLeft: 10, width: 70}} category="h5">
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </Layout>
      </Layout>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} />
        <Text category="h6" style={{marginHorizontal: 10}}>
          {test.name}
        </Text>
        <Text style={{margin: 10}}>{test.summary}</Text>
        <Divider />
        <Text style={{margin: 10}} category="s1">
          How to perform this test
        </Text>
        <ViewMore text={test.how.map(step => `• ${step} \n\n`).join('')} />
        <Divider />
        <Text style={{margin: 10}} category="s1">
          Why is this test important
        </Text>
        <ViewMore text={test.why} />
        <Divider />
        {test.mens && (profile.gender === 'male' || !profile.gender) && (
          <Table table={test.mens} metric={test.metric} title="Mens table" />
        )}
        {test.womens && (profile.gender === 'female' || !profile.gender) && (
          <Table
            table={test.womens}
            metric={test.metric}
            title="Womens table"
          />
        )}
      </ScrollView>
      <Button
        onPress={() => setShowCountdown(true)}
        style={{
          margin: 10,
          marginBottom: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        Start
      </Button>
    </Layout>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(Test);
