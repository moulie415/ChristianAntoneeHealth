import {Text, Toggle} from '@ui-kitten/components';
import React, {useState} from 'react';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform, View} from 'react-native';
import colors from '../../constants/colors';
import SettingsProps from '../../types/views/Settings';
import {MyRootState} from '../../types/Shared';
import {
  setMonthlyTestReminders,
  setWorkoutReminders,
  setWorkoutReminderTime,
} from '../../actions/profile';
import {connect} from 'react-redux';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';

const Settings: React.FC<SettingsProps> = ({
  workoutReminders,
  setWorkoutRemindersAction,
  workoutReminderTime,
  setWorkoutReminderTimeAction,
  monthlyTestReminders,
  setMonthlyTestRemindersAction,
}) => {
  const [show, setShow] = useState(false);
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
          checked={workoutReminders}
          onChange={setWorkoutRemindersAction}
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
        {show ||
          (Platform.OS === 'ios' && (
            <DateTimePicker
              disabled={!workoutReminders}
              style={{width: 100}}
              testID="dateTimePicker"
              value={new Date(workoutReminderTime)}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(_: Event, d: Date) => {
                if (d) {
                  setWorkoutReminderTimeAction(d);
                }
                setShow(Platform.OS === 'ios');
              }}
            />
          ))}
        {Platform.OS === 'android' && (
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text>{moment(workoutReminderTime).format('HH:mm')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        <Text>Monthly Fitness test reminder</Text>
        <Toggle
          checked={monthlyTestReminders}
          onChange={setMonthlyTestRemindersAction}
        />
      </View>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  workoutReminders: profile.workoutReminders,
  workoutReminderTime: profile.workoutReminderTime,
  monthlyTestReminders: profile.monthlyTestReminders,
});

const mapDispatchToProps = {
  setWorkoutRemindersAction: setWorkoutReminders,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
  setMonthlyTestRemindersAction: setMonthlyTestReminders,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
