import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../../App';
import { resetToTabs } from '../../../RootNavigation';
import colors from '../../../constants/colors';
import { keyHasValue } from '../../../helpers/table';
import useThrottle from '../../../hooks/UseThrottle';
import { saveTest } from '../../../reducers/tests';
import { SavedTest } from '../../../types/SavedItem';
import { Profile } from '../../../types/Shared';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import PercentileTable from '../../commons/PercentileTable';
import Table from '../../commons/Table';
import Text from '../../commons/Text';
import TestResultText from './TestResultText';

const TestResults: React.FC<{
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'TestResults'>;
  route: RouteProp<StackParamList, 'TestResults'>;
  saveTest: (test: SavedTest) => void;
}> = ({ profile, route, saveTest: saveTestAction }) => {
  const { testResult, seconds, test } = route.params;

  const gender = profile.gender;

  const noGender = !gender;

  const showMens = gender === 'male';

  const showWomens = gender === 'female';

  const score = testResult || seconds;

  const saveThrottled = useThrottle((saved: boolean) => {
    saveTestAction({
      seconds,
      result: testResult || 0,
      createdate: new Date(),
      testId: test.id,
      saved,
    });
    resetToTabs();
  }, 5000);

  return (
    <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
      <Header hasBack title="Compare result" />

      <View>
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
        {showMens && test.mens && '10th' in test.mens && test.mens['10th'] && (
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

        {!noGender && test.mens && test.womens && (
          <TestResultText
            table={showMens ? test.mens : test.womens}
            score={score}
          />
        )}
        <View style={{ marginHorizontal: 40, marginTop: 20 }}>
          {!!test.source && (
            <Hyperlink linkDefault linkStyle={{ color: colors.appBlue }}>
              <Text style={{ color: colors.appWhite, fontStyle: 'italic' }}>
                {test.source}
              </Text>
            </Hyperlink>
          )}
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {profile.premium && (
          <Button
            style={{ margin: 20 }}
            text="Save result"
            onPress={() => saveThrottled(true)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootState) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = {
  saveTest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
