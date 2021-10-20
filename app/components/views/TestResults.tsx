import {Layout, Text} from '@ui-kitten/components';
import React, { useState } from 'react';
import {View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import TestResultsProp from '../../types/views/TestResults';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import colors from '../../constants/colors';

const TestResults: React.FC<TestResultsProp> = ({route}) => {
  const {test, testResult, testNote, seconds} = route.params;
  const [fill, setFill] = useState(50);
  return (
    <Layout style={{flex: 1}}>
      <Text
        category="h4"
        style={{textAlign: 'center', marginBottom: DevicePixels[10]}}>
        Test complete
      </Text>

      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={120}
        width={15}
        backgroundWidth={5}
        fill={fill}
        tintColor={colors.appBlue}
        tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.appGrey}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => <Text>{Math.round(fill)}</Text>}
      </AnimatedCircularProgress>
    </Layout>
  );
};

export default TestResults;
