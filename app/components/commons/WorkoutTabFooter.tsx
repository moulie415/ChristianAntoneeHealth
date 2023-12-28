import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Exercise from '../../types/Exercise';
import moment from 'moment';

const WorkoutTabFooter: React.FC<{
  index: number;
  workout: Exercise[];
  seconds: number;
  timerPaused: boolean;
  setTimerPaused: (paused: boolean) => void;
  onTimerPaused: (paused: boolean) => void;
}> = ({
  index,
  workout,
  seconds,
  setTimerPaused,
  timerPaused,
  onTimerPaused,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 30,
        paddingVertical: 15,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: colors.appWhite,
          fontSize: 16,
        }}>{`Exercise ${index + 1}/${workout.length}`}</Text>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: colors.appWhite,
            fontSize: 16,
            paddingLeft: 5,
            padding: 15,
          }}>
          {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
        </Text>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            onTimerPaused && onTimerPaused(!timerPaused);
            setTimerPaused(!timerPaused);
          }}>
          <Icon
            name={timerPaused ? 'play' : 'pause'}
            size={20}
            color={colors.appWhite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutTabFooter;
