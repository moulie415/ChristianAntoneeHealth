import moment from 'moment';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import colors from '../../../constants/colors';
import {getSavedTests} from '../../../reducers/tests';
import {SavedTest} from '../../../types/SavedItem';
import Test from '../../../types/Test';
import Button from '../../commons/Button';
import Modal from '../../commons/Modal';
import Spinner from '../../commons/Spinner';
import Text from '../../commons/Text';

const HistoricalTestsModal: React.FC<{
  test: Test;
  visible: boolean;
  onRequestClose: () => void;
  loading: boolean;
  getSavedTestsAction: () => void;
  savedTestsObj: {[key: string]: SavedTest};
}> = ({
  test,
  visible,
  onRequestClose,
  savedTestsObj,
  getSavedTestsAction,
  loading,
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
          {loading ? (
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <Spinner />
            </View>
          ) : (
            <FlatList
              data={savedTests}
              keyExtractor={item => item.id || ''}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.borderColor,
                      padding: 15,
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
                  </View>
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
          )}
        </View>

        <Button text="Close" style={{marginTop: 20}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

const mapStateToProps = ({exercises, tests}: RootState) => ({
  loading: exercises.loading,
  savedTestsObj: tests.savedTests,
});

const mapDispatchToProps = {
  getSavedTestsAction: getSavedTests,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoricalTestsModal);
