import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Exercise from '../../types/Exercise';
import moment from 'moment';

const WorkoutTabFooter: React.FC<{
  index: number;
  workout: Exercise[];
  seconds: number;
  timerPaused: boolean;
  setTimerPaused: (paused: boolean) => void;
}> = ({index, workout, seconds, setTimerPaused, timerPaused}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        height: 60,
        borderRadius: 30,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: colors.appWhite,
          fontSize: 20,
          padding: 15,
        }}>{`Exercise ${index + 1}/${workout.length}`}</Text>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="stopwatch" size={20} color={colors.appWhite} />
        <Text
          style={{
            fontWeight: 'bold',
            color: colors.appWhite,
            fontSize: 20,
            paddingLeft: 5,
            padding: 15,
          }}>
          {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
        </Text>
        <TouchableOpacity onPress={() => setTimerPaused(!timerPaused)}>
          <Icon
            name={timerPaused ? 'play' : 'pause'}
            size={30}
            style={{marginRight: 10}}
            color={colors.appWhite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutTabFooter;
