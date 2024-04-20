import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as _ from 'lodash';
import moment from 'moment';
import React, {FunctionComponent, useCallback, useMemo, useRef} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getSavedWorkouts} from '../../../reducers/exercises';
import {getSavedQuickRoutines} from '../../../reducers/quickRoutines';
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
  loading: boolean;
  savedWorkouts: {[key: string]: SavedWorkout};
  navigation: SavedItemsNavigationProp;
  getSavedWorkoutsAction: () => void;
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
  getSavedQuickRoutinesAction: () => void;
}> = ({loading, savedWorkouts, navigation, savedQuickRoutines}) => {
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

  const cursor = useRef(new Date());

  const loadEarlier = useCallback(async () => {
    const startAfter = _.minBy(saved, 'createdate')?.createdate;
    if (cursor.current === startAfter) {
      return;
    }
    cursor.current = startAfter;
    loadEarlierMessagesAction({chatId, uid, startAfter: Number(startAfter)});
  }, []);

  return (
    <>
      <View>
        <FlatList
          data={saved}
          onEndReached={() => {
            console.log('test');
          }}
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
                  <Icon
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

const mapStateToProps = ({exercises, quickRoutines}: RootState) => ({
  loading: exercises.loading,
  savedWorkouts: exercises.savedWorkouts,
  savedQuickRoutines: quickRoutines.savedQuickRoutines,
});

const mapDispatchToProps = {
  getSavedQuickRoutines,
  getSavedWorkouts,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedWorkouts);
