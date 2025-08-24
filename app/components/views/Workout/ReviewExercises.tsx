import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import colors from '../../../constants/colors';
import {truncate} from '../../../helpers';
import Exercise from '../../../types/Exercise';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {setWorkout} from '../../../reducers/exercises';
import {SettingsState} from '../../../reducers/settings';
import {Profile} from '../../../types/Shared';
import Button from '../../commons/Button';
import Divider from '../../commons/Divider';
import ListItem from '../../commons/ListItem';
import ShareModal from '../../commons/ShareModal';
import Text from '../../commons/Text';

const ReviewExercises: React.FC<{
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  navigation: NativeStackNavigationProp<StackParamList, 'ReviewExercises'>;
  profile: Profile;
  settings: SettingsState;
}> = ({workout, setWorkoutAction, navigation, profile, settings}) => {
  const renderItem = useCallback(
    ({item, drag, isActive}: RenderItemParams<Exercise>) => {
      return (
        <ListItem
          style={{backgroundColor: isActive ? colors.appBlue : undefined}}
          onLongPress={drag}
          title={item.name}
          onPress={() =>
            navigation.navigate('CustomizeExercise', {exercise: item})
          }
          description={truncate(item.description, 75)}
          accessoryLeft={
            <Image
              style={{height: 50, width: 75}}
              source={
                item.thumbnail
                  ? {uri: item.thumbnail.src}
                  : require('../../../images/old_man_stretching.jpeg')
              }
            />
          }
        />
      );
    },
    [navigation],
  );

  return (
    <View style={{flex: 1}}>
      <Text style={{margin: 10, marginBottom: 0}}>Review exercises</Text>
      <Text style={{marginHorizontal: 10}}>(Hold and drag to reorder)</Text>
      <DraggableFlatList
        data={workout}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={navigation.goBack}>
            <View
              style={{
                height: 50,
                width: 75,
                backgroundColor: colors.appBlue,
                marginLeft: 7,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome6
                iconStyle="solid"
                name="plus"
                color="#fff"
                size={25}
              />
            </View>
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 10,
                color: colors.appBlue,
              }}>
              Add exercise
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id || ''}
        onDragEnd={({data}) => setWorkoutAction(data)}
      />
      <Button
        text="Start workout"
        onPress={() => {
          //  navigation.navigate('PreWorkout', {planWorkout: {}});
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          left: 10,
          right: 10,
        }}
      />
      <ShareModal title="Share workout" type="workout" workout={workout} />
    </View>
  );
};

const mapStateToProps = ({exercises, profile, settings}: RootState) => ({
  workout: exercises.workout,
  profile: profile.profile,
  settings,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewExercises);
