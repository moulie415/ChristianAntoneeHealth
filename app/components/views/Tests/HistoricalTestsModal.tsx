import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getSavedTests} from '../../../reducers/tests';
import {SavedTest} from '../../../types/SavedItem';
import Test from '../../../types/Test';
import Button from '../../commons/Button';
import Modal from '../../commons/Modal';
import Text from '../../commons/Text';

const HistoricalTestsModal: React.FC<{
  test: Test;
  visible: boolean;
  onRequestClose: () => void;
  loading: boolean;
  getSavedTestsAction: () => void;
  savedTestsObj: {[key: string]: SavedTest};
  navigation: NativeStackNavigationProp<StackParamList, 'Test'>;
  tests: {[key: string]: Test};
}> = ({
  test,
  visible,
  onRequestClose,
  savedTestsObj,
  getSavedTestsAction,
  loading,
  navigation,
  tests,
}) => {
  useEffect(() => {
    if (visible) {
      getSavedTestsAction();
    }
  }, [visible, getSavedTestsAction]);

  const savedTests = Object.values(savedTestsObj).filter(
    savedTest => savedTest.testId === test.id,
  );
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '95%',
          borderRadius: 10,
          padding: 20,
          height: 400,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 22,
            fontWeight: 'bold',
            padding: 10,
            textAlign: 'center',
          }}>
          Historical
        </Text>
        <View style={{flex: 1}}>
          <FlatList
            data={savedTests}
            keyExtractor={item => item.id || ''}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onRequestClose();
                    navigation.navigate('TestResults', {
                      test: tests[item.testId],
                      seconds: item.seconds || 0,
                      testResult: item.result,
                    });
                  }}
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    padding: 15,
                    marginBottom: 10
                  }}>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontWeight: 'bold',
                      marginBottom: 5,
                    }}>{`Result: ${item.result}`}</Text>
                  <Text style={{color: colors.offWhite}}>
                    {moment(item.createdate).format('MMMM Do YYYY')}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View>
                <Text
                  style={{
                    color: colors.appWhite,
                    marginTop: 100,
                    textAlign: 'center',
                  }}>
                  No historical test results found
                </Text>
              </View>
            }
          />
        </View>

        <Button text="Close" style={{marginTop: 20}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

const mapStateToProps = ({exercises, tests}: RootState) => ({
  loading: exercises.loading,
  savedTestsObj: tests.savedTests,
  tests: tests.tests,
});

const mapDispatchToProps = {
  getSavedTestsAction: getSavedTests,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoricalTestsModal);
