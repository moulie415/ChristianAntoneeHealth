import {StackNavigationProp} from '@react-navigation/stack';
import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import moment from 'moment';
import React, {FunctionComponent, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {connect} from 'react-redux';
import {getSavedQuickRoutines} from '../../../actions/quickRoutines';
import {StackParamList} from '../../../App';
import DevicePixels from '../../../helpers/DevicePixels';
import {getDifficultyEmoji} from '../../../helpers/exercises';
import QuickRoutine from '../../../types/QuickRoutines';
import {SavedQuickRoutine} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import ImageOverlay from '../../commons/ImageOverlay';

type SavedItemsNavigationProp = StackNavigationProp<
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
  return (
    <Layout>
      <List
        data={Object.values(savedQuickRoutines)}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const quickRoutine = quickRoutines[item.quickRoutineId];
          return (
            <ListItem
              onPress={() =>
                Alert.alert('Retry quick routine?', '', [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Yes',
                    onPress: () => {
                      navigation.navigate('QuickRoutine', {
                        routine: quickRoutine,
                      });
                    },
                  },
                ])
              }
              title={`${quickRoutine.name} - ${moment(item.createddate).format(
                'MMMM Do YYYY',
              )}`}
              description={`${quickRoutine.exercises?.length} ${
                quickRoutine.exercises?.length > 1 ? 'exercises' : 'exercise'
              }, ${Math.floor(item.calories)} calories expended`}
              accessoryLeft={() => (
                <ImageOverlay
                  containerStyle={{
                    height: DevicePixels[75],
                    width: DevicePixels[75],
                  }}
                  overlayAlpha={0.4}
                  source={
                    quickRoutine.thumbnail
                      ? {uri: quickRoutine.thumbnail.src}
                      : require('../../../images/old_man_stretching.jpeg')
                  }>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: DevicePixels[12]}}>
                      {'Duration '}
                    </Text>
                    <Text category="h6" style={{color: '#fff'}}>
                      {moment()
                        .utc()
                        .startOf('day')
                        .add({seconds: item.seconds})
                        .format('mm:ss')}
                    </Text>
                  </View>
                </ImageOverlay>
              )}
              accessoryRight={() => (
                <Text style={{fontSize: DevicePixels[30]}}>
                  {getDifficultyEmoji(item.difficulty)}
                </Text>
              )}
            />
          );
        }}
      />
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};

const mapStateToProps = ({exercises, quickRoutines}: MyRootState) => ({
  loading: exercises.loading,
  savedQuickRoutines: quickRoutines.savedQuickRoutines,
  quickRoutines: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getSavedQuickRoutinesAction: getSavedQuickRoutines,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedQuickRoutines);
