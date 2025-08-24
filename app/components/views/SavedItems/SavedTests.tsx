import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {FunctionComponent, useMemo} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {useAppSelector} from '../../../hooks/redux';
import {SavedTest} from '../../../types/SavedItem';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import SavedTestCard from '../../commons/SavedTestCard';
import Text from '../../commons/Text';

const {height} = Dimensions.get('screen');

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedTests: FunctionComponent<{
  navigation: SavedItemsNavigationProp;
  loadEarlier: (saved: SavedTest[]) => void;
}> = ({navigation, loadEarlier}) => {
  const {savedTests} = useAppSelector(state => state.tests);
  const {loading} = useAppSelector(state => state.exercises);
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
                  <FontAwesome6
                    iconStyle="solid"
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
          onEndReached={() => loadEarlier(saved)}
          keyExtractor={item => item.id || ''}
          renderItem={({item}) => {
            return <SavedTestCard item={item} navigation={navigation} />;
          }}
        />
      </View>
    </>
  );
};

export default SavedTests;
