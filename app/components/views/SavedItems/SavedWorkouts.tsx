import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {FunctionComponent, useMemo} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {useAppSelector} from '../../../hooks/redux';
import {SavedQuickRoutine, SavedWorkout} from '../../../types/SavedItem';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import SavedWorkoutCard from '../../commons/SavedWorkoutCard';
import Text from '../../commons/Text';

const {height} = Dimensions.get('screen');

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedWorkouts: FunctionComponent<{
  navigation: SavedItemsNavigationProp;
  loadEarlier: (saved: (SavedQuickRoutine | SavedWorkout)[]) => void;
}> = ({navigation, loadEarlier}) => {
  const {loading, savedWorkouts} = useAppSelector(state => state.exercises);
  const {savedQuickRoutines} = useAppSelector(state => state.quickRoutines);

  const saved = useMemo(
    () =>
      [
        ...Object.values(savedWorkouts),
        ...Object.values(savedQuickRoutines),
      ].sort(
        (a, b) =>
          moment(b.createdate).valueOf() - moment(a.createdate).valueOf(),
      ),
    [savedQuickRoutines, savedWorkouts],
  );

  return (
    <>
      <View>
        <FlatList
          data={saved}
          onEndReached={() => loadEarlier(saved)}
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
                    No saved workouts found
                  </Text>
                  <FontAwesome6
                    iconStyle="solid"
                    name="dumbbell"
                    color={colors.appWhite}
                    size={30}
                    style={{textAlign: 'center', marginTop: 15}}
                  />
                </>
              )}
            </SafeAreaView>
          }
          keyExtractor={item => item.id || ''}
          renderItem={({item}) => {
            return <SavedWorkoutCard item={item} navigation={navigation} />;
          }}
        />
      </View>
    </>
  );
};

export default SavedWorkouts;
