import {
  Divider,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
  Toggle,
  Button,
  IndexPath,
} from '@ui-kitten/components';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform, ScrollView, View} from 'react-native';
import SettingsProps from '../../../types/views/Settings';
import {Goal, MyRootState} from '../../../types/Shared';
import {
  setTestReminders,
  setWorkoutReminders,
  setWorkoutReminderTime,
  updateProfile,
} from '../../../actions/profile';
import {connect} from 'react-redux';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import colors from '../../../constants/colors';
import {goalItems} from '../../../constants';
import * as _ from 'lodash';
import DevicePixels from '../../../helpers/DevicePixels';

const isValidGoal = (goal: Goal) =>
  goal === Goal.STRENGTH || goal === Goal.FITNESS;

const Settings: React.FC<SettingsProps> = ({
  workoutReminders,
  setWorkoutRemindersAction,
  workoutReminderTime,
  setWorkoutReminderTimeAction,
  testReminders,
  setTestRemindersAction,
  profile,
  navigation,
  updateProfileAction,
}) => {
  const [show, setShow] = useState(false);
  const [goal, setGoal] = useState<Goal>(
    profile.goal && isValidGoal(profile.goal) ? profile.goal : Goal.STRENGTH,
  );

  const newProfile = {
    ...profile,
    goal,
  };

  const equal = _.isEqual(newProfile, profile);
  return (
    <Layout style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        <Text style={{margin: DevicePixels[10]}} category="h5">
          Notifications
        </Text>
        <Divider />
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: DevicePixels[10],
          }}>
          <Text>Workout reminders</Text>
          <Toggle
            checked={workoutReminders}
            onChange={setWorkoutRemindersAction}
          />
        </Layout>
        <Divider />
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: DevicePixels[10],
          }}>
          <Text>Fitness test reminder</Text>
          <Toggle checked={testReminders} onChange={setTestRemindersAction} />
        </Layout>
        <Divider />
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: DevicePixels[10],
          }}>
          <Text style={{flex: 1}}>Time of reminder</Text>
          {(show || Platform.OS === 'ios') && (
            <DateTimePicker
              disabled={!workoutReminders && !testReminders}
              style={{width: DevicePixels[100]}}
              testID="dateTimePicker"
              value={new Date(workoutReminderTime)}
              // placeholderText="Select date"
              mode="time"
              // is24Hour={true}
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={(event, d: Date) => {
                if (d) {
                  setWorkoutReminderTimeAction(d);
                }
                setShow(Platform.OS === 'ios');
              }}
            />
          )}
          {Platform.OS === 'android' && (
            <TouchableOpacity
              disabled={!workoutReminders && !testReminders}
              onPress={() => setShow(true)}>
              <Text>{moment(workoutReminderTime).format('HH:mm')}</Text>
            </TouchableOpacity>
          )}
        </Layout>
        <Divider />
      </ScrollView>
      {/* <Button
        onPress={() => {
          navigation.goBack();
          updateProfileAction(newProfile);
        }}
        disabled={equal}
        style={{
          margin: DevicePixels[10],
          marginBottom: DevicePixels[20],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        Save
      </Button> */}
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  workoutReminders: profile.workoutReminders,
  workoutReminderTime: profile.reminderTime,
  testReminders: profile.testReminders,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutRemindersAction: setWorkoutReminders,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
  setTestRemindersAction: setTestReminders,
  updateProfileAction: updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
