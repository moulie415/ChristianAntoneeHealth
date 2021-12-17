import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Alert, View} from 'react-native';
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
    getTestsByIdAction(missingTests);
  }, [getTestsByIdAction, missingTests]);
  return (
    <>
      <Layout>
        {!missingTests.length && (
          <List
            data={Object.values(savedTests)}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              const test = tests[item.testId];
              return (
                <ListItem
                  onPress={() =>
                    Alert.alert('Retry test?', '', [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          navigation.navigate('Test', {id: item.testId});
                        },
                      },
                    ])
                  }
                  title={`${test.name} - ${moment(item.createddate).format(
                    'MMMM Do YYYY',
                  )}`}
                  description={''}
                  accessoryLeft={() => (
                    <ImageOverlay
                      containerStyle={{
                        height: DevicePixels[75],
                        width: DevicePixels[75],
                      }}
                      overlayAlpha={0.4}
                      source={require('../../../images/old_man_stretching.jpeg')}>
                      <View style={{alignItems: 'center'}}>
                        <Text
                          style={{color: '#fff', fontSize: DevicePixels[12]}}>
                          {'Duration '}
                        </Text>
                        <Text category="h6" style={{color: '#fff'}}>
                          {item.seconds
                            ? moment()
                                .utc()
                                .startOf('day')
                                .add({seconds: item.seconds})
                                .format('mm:ss')
                            : 'N/A'}
                        </Text>
                      </View>
                    </ImageOverlay>
                  )}
                />
              );
            }}
          />
        )}
      </Layout>
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
