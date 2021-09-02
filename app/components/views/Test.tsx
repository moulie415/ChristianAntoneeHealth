import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import {Table as TableType, Row as RowType} from '../../types/Test';
import moment from 'moment';
import {ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import TestProps from '../../types/views/Test';
import ExerciseVideo from '../commons/ExerciseVideo';
import {SAMPLE_VIDEO_LINK} from '../../constants/strings';
import colors from '../../constants/colors';
import Countdown from '../commons/Countdown';
import ViewMore from '../commons/ViewMore';

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});

const Test: React.FC<TestProps> = ({route, tests, profile}) => {
  const {id} = route.params;
  const test = tests[id];
  const [testStarted, setTestStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);

  const getTable = (table: TableType) => {
    const getRowArr = (row: RowType) => {
      return Object.values(row)
        .reverse()
        .map(col => `${col.lower || ''} - ${col.higher || ''}`);
    };
    const tableHead = ['', ...getRowArr(table.age)];
    const tableTitle = [];
    const tableData = [];

    table.excellent &&
      tableData.push(getRowArr(table.excellent)) &&
      tableTitle.push('Excellent');

    table.good &&
      tableData.push(getRowArr(table.good)) &&
      tableTitle.push('Good');

    table.aboveAverage &&
      tableData.push(getRowArr(table.aboveAverage)) &&
      tableTitle.push('Above average');

    table.average &&
      tableData.push(getRowArr(table.average)) &&
      tableTitle.push('Average');

    table.belowAverage &&
      tableData.push(getRowArr(table.belowAverage)) &&
      tableTitle.push('Below average');

    table.poor &&
      tableData.push(getRowArr(table.poor)) &&
      tableTitle.push('Poor');

    table.poor &&
      tableData.push(getRowArr(table.poor)) &&
      tableTitle.push('Very poor');
    return {
      tableHead,
      tableTitle,
      tableData,
    };
  };
  const mensTable = test.mens && getTable(test.mens);
  const womensTable = test.womens && getTable(test.womens);
  useEffect(() => {
    if (testStarted) {
      const start = moment().unix();
      const intervalID = setInterval(() => {
        setSeconds(Math.floor(moment().unix() - start));
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [testStarted]);

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
