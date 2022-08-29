import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform, ScrollView, Switch, View} from 'react-native';
import SettingsProps from '../../../types/views/Settings';
import {Goal, MyRootState} from '../../../types/Shared';
import {
  setTestReminders,
  setTestReminderTime,
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
import Text from '../../commons/Text';
import Button from '../../commons/Button';
import Divider from '../../commons/Divider';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import Toggle from '../../commons/Toggle';

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
  testReminderTime,
  setTestReminderTimeAction,
}) => {
  const [showWorkoutDate, setShowWorkoutDate] = useState(false);
  const [showTestDate, setShowTestDate] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date(workoutReminderTime));
  const [testDate, setTestDate] = useState(new Date(testReminderTime));
  const [marketing, setMarketing] = useState(profile.marketing);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<Goal>(
    profile.goal && isValidGoal(profile.goal) ? profile.goal : Goal.STRENGTH,
  );

  const newProfile = {
    ...profile,
    goal,
    marketing,
  };

  const equal =
    _.isEqual(newProfile, profile) &&
    _.isEqual(workoutDate.toISOString(), workoutReminderTime) &&
    _.isEqual(testDate.toISOString(), testReminderTime);

  return (
    <View style={{flex: 1, backgroundColor: colors.appBlack}}>
      <SafeAreaView>
        <Header hasBack title="Settings" />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
          <Text
            style={{
              margin: DevicePixels[10],
              fontSize: DevicePixels[22],
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Notifications
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: DevicePixels[10],
              backgroundColor: '#212121',
              height: DevicePixels[60],
              paddingHorizontal: DevicePixels[10],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
              }}>
              Workout reminders
            </Text>
            <Toggle
              value={workoutReminders}
              onValueChange={setWorkoutRemindersAction}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: DevicePixels[10],
              backgroundColor: '#212121',
              height: DevicePixels[60],
              paddingHorizontal: DevicePixels[10],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
              }}>
              Fitness test reminder
            </Text>
            <Toggle
              value={testReminders}
              onValueChange={setTestRemindersAction}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowTestDate(true)}
            disabled={Platform.OS === 'ios'}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: DevicePixels[10],
              backgroundColor: '#212121',
              height: DevicePixels[60],
              paddingHorizontal: DevicePixels[10],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
              }}>
              Time of workout reminder
            </Text>
            {(showWorkoutDate || Platform.OS === 'ios') && (
              <DateTimePicker
                disabled={!workoutReminders}
                style={{width: DevicePixels[90]}}
                testID="dateTimePicker"
                value={new Date(workoutDate)}
                // placeholderText="Select date"
                mode="time"
                // is24Hour={true}
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(event, d: Date) => {
                  if (d) {
                    setWorkoutDate(d);
                  }
                  setShowWorkoutDate(Platform.OS === 'ios');
                }}
              />
            )}
            {Platform.OS === 'android' && (
              <TouchableOpacity
                disabled={!workoutReminders}
                onPress={() => setShowWorkoutDate(true)}>
                <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                  {moment(workoutDate).format('HH:mm')}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowTestDate(true)}
            disabled={Platform.OS === 'ios'}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: DevicePixels[10],
              backgroundColor: '#212121',
              height: DevicePixels[60],
              paddingHorizontal: DevicePixels[10],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
              }}>
              Time of test reminder
            </Text>
            {(showTestDate || Platform.OS === 'ios') && (
              <DateTimePicker
                disabled={!testReminders}
                style={{width: DevicePixels[90]}}
                testID="dateTimePicker"
                value={new Date(testDate)}
                // placeholderText="Select date"
                mode="time"
                // is24Hour={true}
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(event, d: Date) => {
                  if (d) {
                    setTestDate(d);
                  }
                  setShowTestDate(Platform.OS === 'ios');
                }}
              />
            )}
            {Platform.OS === 'android' && (
              <TouchableOpacity
                disabled={!testReminders}
                onPress={() => setShowTestDate(true)}>
                <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                  {moment(testDate).format('HH:mm')}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <Text
            style={{
              margin: DevicePixels[10],
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: DevicePixels[22],
            }}>
            Emails
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: DevicePixels[10],
              backgroundColor: '#212121',
              height: DevicePixels[60],
              paddingHorizontal: DevicePixels[10],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
                width: '80%',
              }}>
              Receive offers and info on future updates
            </Text>
            <Toggle value={marketing} onValueChange={setMarketing} />
          </View>
        </ScrollView>

        <Button
          onPress={() => {
            setLoading(true);
            navigation.goBack();
            setTestReminderTimeAction(testDate);
            setWorkoutReminderTimeAction(workoutDate);
            updateProfileAction(newProfile);
          }}
          text="Save"
          disabled={equal || loading}
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  workoutReminders: profile.workoutReminders,
  workoutReminderTime: profile.reminderTime,
  testReminderTime: profile.testReminderTime,
  testReminders: profile.testReminders,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutRemindersAction: setWorkoutReminders,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
  setTestReminderTimeAction: setTestReminderTime,
  setTestRemindersAction: setTestReminders,
  updateProfileAction: updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
