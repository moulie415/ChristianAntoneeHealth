import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {FunctionComponent, useMemo} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {SavedTest} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import SavedTestCard from '../../commons/SavedTestCard';
import Text from '../../commons/Text';

const {height} = Dimensions.get('screen');

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedTests: FunctionComponent<{
  loading: boolean;
  savedTests: {[key: string]: SavedTest};
  getSavedTestsAction: () => void;
  navigation: SavedItemsNavigationProp;
}> = ({loading, savedTests, navigation}) => {
  const saved = useMemo(
    () =>
      Object.values(savedTests).sort(
        (a, b) => moment(b).valueOf() - moment(a).valueOf(),
      ),
    [savedTests],
  );

  return (
    <>
      <View>
        <FlatList
          ListEmptyComponent={
            <SafeAreaView style={{height: height / 2}}>
              {loading ? (
                <AbsoluteSpinner
                  loading
                  style={{backgroundColor: colors.appGrey}}
                />
              ) : (
                <>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.appWhite,
                      fontSize: 16,
                    }}>
                    No saved tests found
                  </Text>
                  <Icon
                    name="heart-pulse"
                    color={colors.appWhite}
                    size={30}
                    style={{textAlign: 'center', marginTop: 15}}
                  />
                </>
              )}
            </SafeAreaView>
          }
          data={saved}
          keyExtractor={item => item.id || ''}
          renderItem={({item}) => {
            return <SavedTestCard item={item} navigation={navigation} />;
          }}
        />
      </View>
    </>
  );
};

const mapStateToProps = ({exercises, tests}: MyRootState) => ({
  loading: exercises.loading,
  savedTests: tests.savedTests,
});

export default connect(mapStateToProps)(SavedTests);
