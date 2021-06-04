import {ListItem, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useState} from 'react';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Snackbar from 'react-native-snackbar';
import {Platform, ScrollView, View} from 'react-native';
import colors from '../../constants/colors';
import CustomizeExerciseProps from '../../types/views/CustomExercise';
import CustomDivider from '../commons/CustomDivider';
import Exercise from '../../types/Exercise';
import {MyRootState} from '../../types/Shared';
import {setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';
import ViewMore from '../commons/ViewMore';

const REPS = [5, 10, 15, 20, 25, 30];
const SETS = [1, 2, 3, 4, 5, 6];

const PickerItem = Picker.Item;

const CustomizeExercise: FunctionComponent<CustomizeExerciseProps> = ({
  route,
  workout,
  setWorkoutAction,
  navigation,
}) => {
  const {exercise} = route.params;
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
  const selectExercise = () => {
    if (workout.find(e => e.id === exercise.id)) {
      setWorkoutAction(workout.filter(e => e.id !== exercise.id));
      Snackbar.show({text: 'Exercise removed'});
    } else {
      setWorkoutAction([
        ...workout,
        {
          ...exercise,
          reps: Number(reps),
          sets: Number(sets),
        },
      ]);
      Snackbar.show({text: 'Exercise added'});
    }
    navigation.goBack();
  };
  return (
    <ScrollView style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text category="h5" style={{margin: 10}}>
        Customise exercise
      </Text>
      {Platform.OS === 'ios' ? (
        <Video
          source={{
            uri:
              'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
          }}
          controls
          style={{height: 250, marginBottom: 10}}
          repeat
        />
      ) : (
        <VideoPlayer
          style={{height: 250, marginBottom: 10}}
          disableVolume
          disableBack
          repeat
          source={{
            uri:
              'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
          }}
        />
      )}
      <Text category="h5" style={{textAlign: 'center', marginBottom: 10}}>
        {exercise.name}
      </Text>
      <CustomDivider />
      <ListItem
        title="View similar exercises"
        style={{backgroundColor: colors.appBlack}}
        accessoryLeft={() => <Icon name="sync" color="#fff" />}
      />
      <CustomDivider />
      <ListItem
        onPress={selectExercise}
        title={
          workout.find(e => e.id === exercise.id)
            ? 'Remove exercise'
            : 'Add exercise'
        }
        style={{backgroundColor: colors.appBlack}}
        accessoryLeft={() => (
          <Icon
            name={workout.find(e => e.id === exercise.id) ? 'trash' : 'plus'}
            color="#fff"
          />
        )}
      />
      <CustomDivider />
      <ViewMore text={exercise.description} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 10,
        }}>
        <View>
          <Text category="s1" style={{textAlign: 'center'}}>
            Repetitions
          </Text>
          <Picker
            style={{width: 150, height: 180}}
            selectedValue={reps}
            itemStyle={{color: 'white', fontSize: 26}}
            lineColor="#fff"
            onValueChange={setReps}>
            {REPS.map(value => (
              <PickerItem label={value.toString()} value={value} key={value} />
            ))}
          </Picker>
        </View>
        <View>
          <Text category="s1" style={{textAlign: 'center'}}>
            Sets
          </Text>
          <Picker
            style={{width: 150, height: 180}}
            selectedValue={sets}
            lineColor="#fff"
            itemStyle={{color: 'white', fontSize: 26}}
            onValueChange={setSets}>
            {SETS.map(value => (
              <PickerItem label={value.toString()} value={value} key={value} />
            ))}
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeExercise);
