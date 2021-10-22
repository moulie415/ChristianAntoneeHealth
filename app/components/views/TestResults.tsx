import {Button, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import TestResultsProp from '../../types/views/TestResults';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import moment from 'moment';
import colors from '../../constants/colors';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import {
  capitalizeFirstLetter,
  getCategoryColor,
  getCategoryString,
  getScoreIcon,
  getTableAverage,
  getTableCategory,
  getTableColumn,
  getTableMax,
} from '../../helpers';
import { resetToTabs } from '../../RootNavigation';

const TestResults: React.FC<TestResultsProp> = ({route, profile}) => {
  const {test, testResult, testNote, seconds} = route.params;
  const table = profile.gender === 'male' ? test.mens : test.womens;
  const age = profile.dob && moment().diff(profile.dob, 'years');
  const col = getTableColumn(table, age);
  const score = testResult || seconds;
  const category = getTableCategory(table, col, score);
  const max = getTableMax(table, col);
  const average = getTableAverage(table, col);

  const [fill, setFill] = useState((100 / max) * score);
  return (
    <Layout style={{flex: 1}}>
      <Text
        category="h4"
        style={{textAlign: 'center', marginVertical: DevicePixels[10]}}>
        Test complete!
      </Text>

      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={DevicePixels[120]}
        width={DevicePixels[15]}
        backgroundWidth={DevicePixels[5]}
        fill={fill}
        tintColor={getCategoryColor(category)}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.appGrey}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => <Text category="h4">{score}</Text>}
      </AnimatedCircularProgress>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {getScoreIcon(category) === '-' ? (
          <Text
            style={{fontSize: DevicePixels[30], marginRight: DevicePixels[10]}}>
            -
          </Text>
        ) : (
          <Icon
            style={{fontSize: DevicePixels[20], marginRight: DevicePixels[10]}}
            name={getScoreIcon(category)}
          />
        )}
        <Text category="h5">{`${getCategoryString(category)} score`}</Text>
      </Layout>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 20,
        }}>
        <Icon
          style={{fontSize: 20, marginHorizontal: 10}}
          name="tachometer-alt"
        />
        <Text
          style={{
            fontSize: 16,
            flex: 1,
          }}>
          {'You score is '}
          <Text style={{fontWeight: 'bold'}}>
            {getCategoryString(category)}
          </Text>
          {` for your age (${age}) and gender! `}
          {average ? (
            <Text>{`The average for your age and gender is between ${average.lower} and ${average.higher}`}</Text>
          ) : null}
        </Text>
        <Button onPress={resetToTabs}>Save result</Button>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state: MyRootState) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToProps)(TestResults);
