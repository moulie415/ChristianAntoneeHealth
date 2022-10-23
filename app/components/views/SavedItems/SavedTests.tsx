import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Alert, FlatList, View} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {getSavedTests, getTestsById} from '../../../actions/tests';
import {SavedTest} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import ImageOverlay from '../../commons/ImageOverlay';
import DevicePixels from '../../../helpers/DevicePixels';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Test from '../../../types/Test';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import Text from '../../commons/Text';
import ListItem from '../../commons/ListItem';
import SavedTestCard from '../../commons/SavedTestCard';
import {openSettings} from 'react-native-permissions';

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedTests: FunctionComponent<{
  loading: boolean;
  savedTests: {[key: string]: SavedTest};
  getSavedTestsAction: () => void;
  tests: {[key: string]: Test};
  navigation: SavedItemsNavigationProp;
  getTestsByIdAction: (ids: string[]) => void;
}> = ({
  loading,
  savedTests,
  getSavedTestsAction,
  tests,
  navigation,
  getTestsByIdAction,
}) => {
  useEffect(() => {
    getSavedTestsAction();
  }, [getSavedTestsAction]);

  const missingTests = useMemo(() => {
    return Object.values(savedTests)
      .filter(test => !tests[test.testId])
      .map(test => test.testId);
  }, [savedTests, tests]);

  useEffect(() => {
    if (missingTests.length) {
      getTestsByIdAction(missingTests);
    }
  }, [getTestsByIdAction, missingTests]);
  return (
    <>
      <View>
        {!missingTests.length && (
          <FlatList
            data={Object.values(savedTests).sort(
              (a, b) => moment(b).valueOf() - moment(a).valueOf(),
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return <SavedTestCard item={item} navigation={navigation} />;
            }}
          />
        )}
      </View>
      <AbsoluteSpinner loading={loading} />
    </>
  );
};

const mapStateToProps = ({exercises, tests}: MyRootState) => ({
  loading: exercises.loading,
  savedTests: tests.savedTests,
  tests: tests.tests,
});

const mapDispatchToProps = {
  getSavedTestsAction: getSavedTests,
  getTestsByIdAction: getTestsById,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedTests);
