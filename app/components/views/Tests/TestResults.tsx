import React, {useEffect} from 'react';
import TestResultsProp from '../../../types/views/TestResults';
import moment from 'moment';
import colors from '../../../constants/colors';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Hyperlink from 'react-native-hyperlink';
import {resetToTabs} from '../../../RootNavigation';
import {saveTest} from '../../../actions/tests';
import {Alert, ImageBackground, View} from 'react-native';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThrottle from '../../../hooks/UseThrottle';
import {ScrollView} from 'react-native-gesture-handler';
import Table from '../../commons/Table';
import PercentileTable from '../../commons/PercentileTable';
import {keyHasValue} from '../../../helpers/table';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TestResultText from './TestResultText';
import Header from '../../commons/Header';
import Divider from '../../commons/Divider';

const TestResults: React.FC<TestResultsProp> = ({
  route,
  profile,
  saveTestAction,
  navigation,
}) => {
  const {test, testResult, seconds} = route.params;

  // const table = profile.gender === 'male' ? test.mens : test.womens;
  const age = profile.dob && moment().diff(profile.dob, 'years');

  const gender = profile.gender;

  const noGender = !gender;

  const showMens = gender === 'male';

  const showWomens = gender === 'female';

  const score = testResult || seconds;

  const save = useThrottle((saved: boolean) => {
    saveTestAction({
      seconds,
      result: testResult || 0,
      createdate: new Date(),
      testId: test.id,
      saved,
    });
  }, 5000);

  useEffect(() => {
    if (profile.premium) {
      Alert.alert(
        'Save test result?',
        'Do you want to save this test result to view later?',
        [
          {
            text: 'No',
            onPress: () => {
              save(false);
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              save(true);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      save(false);
    }
  }, [saveTestAction, test.id, profile.premium, seconds, testResult, save]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 22,
          fontWeight: 'bold',
          padding: 10,
          textAlign: 'center',
        }}>
        Test Complete!
      </Text>
      <View>
        <View style={{padding: 10, paddingTop: 0}}>
          {showMens &&
            test.mens &&
            'age' in test.mens &&
            keyHasValue(test.mens, 'age') && (
              <Table
                score={score}
                table={test.mens}
                metric={test.metric}
                title="Mens table"
              />
            )}
          {showWomens &&
            test.womens &&
            'age' in test.womens &&
            keyHasValue(test.womens, 'age') && (
              <Table
                score={score}
                table={test.womens}
                metric={test.metric}
                title="Women's table"
              />
            )}
          {showMens &&
            test.mens &&
            '10th' in test.mens &&
            test.mens['10th'] && (
              <PercentileTable
                score={score}
                table={test.mens}
                title="Mens percentile table"
              />
            )}
          {showWomens &&
            test.womens &&
            '10th' in test.womens &&
            test.womens['10th'] && (
              <PercentileTable
                score={score}
                table={test.womens}
                title="Women's percentile table"
              />
            )}
        </View>

        {!noGender && test.source && (
          <Hyperlink linkDefault linkStyle={{color: colors.appBlue}}>
            <Text style={{margin: 10, color: colors.appWhite}}>
              {test.source}
            </Text>
          </Hyperlink>
        )}

        <Divider style={{marginBottom: 10}} />

        {!noGender && test.mens && test.womens && (
          <TestResultText
            table={showMens ? test.mens : test.womens}
            score={score}
          />
        )}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: colors.appGrey,
          padding: 20,
        }}>
        <Button
          text="Return Home"
          onPress={resetToTabs}
          style={{marginBottom: 10, marginTop: 20}}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: MyRootState) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = {
  saveTestAction: saveTest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
