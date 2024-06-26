import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {getDifficultyEmoji} from '../../../helpers/exercises';
import {getSavedQuickRoutines} from '../../../reducers/quickRoutines';
import QuickRoutine from '../../../types/QuickRoutines';
import {SavedQuickRoutine} from '../../../types/SavedItem';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import ImageOverlay from '../../commons/ImageOverlay';
import ListItem from '../../commons/ListItem';
import Text from '../../commons/Text';

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedQuickRoutines: FunctionComponent<{
  loading: boolean;
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
  getSavedQuickRoutinesAction: () => void;
  quickRoutines: {[key: string]: QuickRoutine};
  navigation: SavedItemsNavigationProp;
}> = ({
  loading,
  savedQuickRoutines,
  getSavedQuickRoutinesAction,
  quickRoutines,
  navigation,
}) => {
  useEffect(() => {
    getSavedQuickRoutinesAction();
  }, [getSavedQuickRoutinesAction]);

  const missingRoutines = useMemo(() => {
    return Object.values(savedQuickRoutines)
      .filter(routine => !quickRoutines[routine.quickRoutineId])
      .map(routine => routine.quickRoutineId);
  }, [quickRoutines, savedQuickRoutines]);

  return (
    <>
      <View>
        {!missingRoutines.length && (
          <FlatList
            data={Object.values(savedQuickRoutines)}
            keyExtractor={item => item.id || ''}
            renderItem={({item}) => {
              const quickRoutine = quickRoutines[item.quickRoutineId];
              return (
                <ListItem
                  onPress={() => {
                    navigation.navigate('PreQuickRoutine', {
                      routine: quickRoutine,
                    });
                  }}
                  title={`${quickRoutine.name} - ${moment(
                    item.createdate,
                  ).format('MMMM Do YYYY')}`}
                  description={`${quickRoutine.exerciseIds?.length} ${
                    quickRoutine.exerciseIds?.length > 1
                      ? 'exercises'
                      : 'exercise'
                  }, ${Math.floor(item.calories)} calories expended`}
                  accessoryLeft={
                    <ImageOverlay
                      containerStyle={{
                        height: 75,
                        width: 75,
                      }}
                      overlayAlpha={0.4}
                      source={
                        quickRoutine.thumbnail
                          ? {uri: quickRoutine.thumbnail.src}
                          : require('../../../images/old_man_stretching.jpeg')
                      }>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{color: '#fff', fontSize: 12}}>
                          {'Duration '}
                        </Text>
                        <Text style={{color: '#fff'}}>
                          {moment()
                            .utc()
                            .startOf('day')
                            .add({seconds: item.seconds})
                            .format('mm:ss')}
                        </Text>
                      </View>
                    </ImageOverlay>
                  }
                  accessoryRight={
                    <Text style={{fontSize: 30}}>
                      {getDifficultyEmoji(item.difficulty)}
                    </Text>
                  }
                />
              );
            }}
          />
        )}
      </View>
      <AbsoluteSpinner loading={loading} />
    </>
  );
};

const mapStateToProps = ({exercises, quickRoutines}: RootState) => ({
  loading: exercises.loading,
  savedQuickRoutines: quickRoutines.savedQuickRoutines,
  quickRoutines: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getSavedQuickRoutinesAction: getSavedQuickRoutines,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedQuickRoutines);
