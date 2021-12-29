import {Button, Divider, Layout, ListItem, Text} from '@ui-kitten/components';
import React, {useCallback, useEffect} from 'react';
import Image from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import colors from '../../../constants/colors';
import {UNIT_ID_INTERSTITIAL} from '../../../constants';
import Exercise from '../../../types/Exercise';
import ReviewExercisesProps from '../../../types/views/ReviewExercises';
import {truncate} from '../../../helpers';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {setWorkout} from '../../../actions/exercises';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DevicePixels from '../../../helpers/DevicePixels';
import {useInterstitialAd} from '@react-native-admob/admob';

const ReviewExercises: React.FC<ReviewExercisesProps> = ({
  workout,
  setWorkoutAction,
  navigation,
  profile,
}) => {
  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);

  useEffect(() => {
    if (adDismissed) {
      navigation.navigate('StartWorkout');
    }
  }, [adDismissed, navigation]);

  const renderItem = useCallback(
    ({item, index, drag, isActive}: RenderItemParams<Exercise>) => {
      return (
        <ListItem
          style={{backgroundColor: isActive ? colors.appBlue : undefined}}
          onLongPress={drag}
          title={item.name}
          onPress={() =>
            navigation.navigate('CustomizeExercise', {exercise: item})
          }
          description={truncate(item.description, 75)}
          accessoryLeft={() => (
            <Image
              style={{height: DevicePixels[50], width: DevicePixels[75]}}
              source={
                item.thumbnail
                  ? {uri: item.thumbnail.src}
                  : require('../../../images/old_man_stretching.jpeg')
              }
            />
          )}
        />
      );
    },
    [navigation],
  );

  return (
    <Layout style={{flex: 1}}>
      <Text style={{margin: DevicePixels[10], marginBottom: 0}} category="h5">
        Review exercises
      </Text>
      <Text style={{marginHorizontal: DevicePixels[10]}} appearance="hint">
        (Hold and drag to reorder)
      </Text>
      <DraggableFlatList
        data={workout}
        style={{flex: 1}}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={navigation.goBack}>
            <Layout
              style={{
                height: DevicePixels[50],
                width: DevicePixels[75],
                backgroundColor: colors.appBlue,
                marginLeft: DevicePixels[7],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="plus" size={DevicePixels[25]} />
            </Layout>
            <Text
              category="s1"
              style={{
                alignSelf: 'center',
                marginLeft: DevicePixels[10],
                color: colors.appBlue,
              }}>
              Add exercise
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        onDragEnd={({data}) => setWorkoutAction(data)}
      />
      <Button
        onPress={() => {
          if (!profile.premium && adLoaded) {
            show();
          } else {
            navigation.navigate('StartWorkout');
          }
        }}
        style={{
          position: 'absolute',
          bottom: DevicePixels[30],
          left: DevicePixels[10],
          right: DevicePixels[10],
        }}>
        Start workout
      </Button>
    </Layout>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  workout: exercises.workout,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewExercises);
