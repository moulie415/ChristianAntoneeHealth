import {Text, Toggle} from '@ui-kitten/components';
import React, {useState} from 'react';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {View} from 'react-native';
import colors from '../../constants/colors';
import SettingsProps from '../../types/views/Settings';
import moment from 'moment';
import {MyRootState} from '../../types/Shared';
import {
  setWorkoutRemindersDisabled,
  setWorkoutReminderTime,
} from '../../actions/profile';
import {connect} from 'react-redux';

const Settings: React.FC<SettingsProps> = ({
  workoutRemindersDisabled,
  setWorkoutReminderDisabledAction,
  workoutReminderTime,
  setWorkoutReminderTimeAction,
}) => {
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text style={{margin: 10}} category="h5">
        Notifications
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        <Text>Workout reminders</Text>
        <Toggle
          checked={!workoutRemindersDisabled}
          onChange={value => setWorkoutReminderDisabledAction(!value)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        <Text style={{flex: 1}}>Time of reminder</Text>
        <DateTimePicker
          disabled={workoutRemindersDisabled}
          style={{width: 100}}
          testID="dateTimePicker"
          value={moment.unix(workoutReminderTime).toDate()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(_: Event, d: Date) =>
            setWorkoutReminderTimeAction(moment(d).unix())
          }
        />
      </View>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  workoutRemindersDisabled: profile.workoutRemindersDisabled,
  workoutReminderTime: profile.workoutReminderTime,
});

const mapDispatchToProps = {
  setWorkoutReminderDisabledAction: setWorkoutRemindersDisabled,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
