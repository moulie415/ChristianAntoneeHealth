import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform, ScrollView, Switch, View} from 'react-native';
import {Goal, MyRootState} from '../../../types/Shared';
import {
  setAutoPlay,
  setPrepTime,
  setTestReminders,
  setTestReminderTime,
  setWorkoutReminders,
  setWorkoutReminderTime,
  updateProfile,
  UpdateProfilePayload,
} from '../../../actions/profile';
import {connect} from 'react-redux';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import colors from '../../../constants/colors';
import * as _ from 'lodash';
import Text from '../../commons/Text';
import Button from '../../commons/Button';
import Divider from '../../commons/Divider';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import Toggle from '../../commons/Toggle';
import {CLIENT_PREMIUM, PREP_TIME_SECS} from '../../../constants';
import isTestFlight from '../../../helpers/isTestFlight';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {SettingsState} from '../../../reducers/settings';
import PickerModal from '../../commons/PickerModal';

const isValidGoal = (goal: Goal) =>
  goal === Goal.STRENGTH || goal === Goal.ACTIVE || goal === Goal.WEIGHT_LOSS;

const Settings: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
  workoutReminders: boolean;
  workoutReminderTime: string;
  testReminderTime: string;
  setWorkoutRemindersAction: (disabled: boolean) => void;
  setWorkoutReminderTimeAction: (date: Date) => void;
  setTestReminderTimeAction: (date: Date) => void;
  testReminders: boolean;
  setTestRemindersAction: (enabled: boolean) => void;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  settings: SettingsState;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  prepTime: number;
  setPrepTime: (prepTime: number) => void;
}> = ({
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
  settings,
  autoPlay,
  setAutoPlay: setAutoPlayAction,
  prepTime,
  setPrepTime: setPrepTimeAction,
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
  const [showPrepTime, setShowPrepTime] = useState(false);

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
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header hasBack title="Settings" />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingBottom: 100}}>
          {((profile.premium && profile.premium[CLIENT_PREMIUM]) ||
            profile.admin ||
            isTestFlight()) && (
            <>
              <Text
                style={{
                  margin: 10,
                  fontSize: 22,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                }}>
                Workouts
              </Text>

              <TouchableOpacity
                onPress={() => setAutoPlayAction(!autoPlay)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  backgroundColor: colors.tile,
                  height: 60,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Auto-play
                </Text>
                <Toggle value={autoPlay} onValueChange={setAutoPlayAction} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowPrepTime(true)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  backgroundColor: colors.tile,
                  height: 60,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Exercise prepare time
                </Text>
                <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                  {`${prepTime} secs`}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  margin: 10,
                  fontSize: 22,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                }}>
                Notifications
              </Text>

              <TouchableOpacity
                onPress={() => setWorkoutRemindersAction(!workoutReminders)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  backgroundColor: colors.tile,
                  height: 60,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Workout reminders
                </Text>
                <Toggle
                  value={workoutReminders}
                  onValueChange={setWorkoutRemindersAction}
                />
              </TouchableOpacity>

              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  backgroundColor: '#212121',
                  height: 60,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Fitness test reminder
                </Text>
                <Toggle
                  value={testReminders}
                  onValueChange={setTestRemindersAction}
                />
              </View> */}

              <TouchableOpacity
                onPress={() => setShowWorkoutDate(true)}
                disabled={Platform.OS === 'ios'}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  backgroundColor: colors.tile,
                  height: 60,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  overflow: 'hidden',
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Time of workout reminder
                </Text>
                {(showWorkoutDate || Platform.OS === 'ios') && (
                  <DateTimePicker
                    disabled={!workoutReminders}
                    style={{width: 150}}
                    testID="time"
                    value={new Date(workoutDate)}
                    textColor={colors.appWhite}
                    // placeholderText="Select date"
                    mode="time"
                    // is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, d: Date | undefined) => {
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

              {/* <TouchableOpacity
                onPress={() => setShowTestDate(true)}
                disabled={Platform.OS === 'ios'}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  backgroundColor: '#212121',
                  height: 60,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: colors.appWhite,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Time of test reminder
                </Text>
                {(showTestDate || Platform.OS === 'ios') && (
                  <DateTimePicker
                    disabled={!testReminders}
                    style={{width: 90}}
                    testID="dateTimePicker"
                    value={new Date(testDate)}
                    // placeholderText="Select date"
                    mode="time"
                    // is24Hour={true}
                    display={Platform.OS === 'ios' ? 'compact' : 'default'}
                    onChange={(event, d: Date | undefined) => {
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
              </TouchableOpacity> */}
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 12,
                  color: colors.appWhite,
                  marginLeft: 10,
                }}>
                Please note these reminders are for custom plans
              </Text>
            </>
          )}
          <Text
            style={{
              margin: 10,
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 22,
            }}>
            Emails
          </Text>
          <TouchableOpacity
            onPress={() => setMarketing(!marketing)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
              backgroundColor: colors.tile,
              height: 60,
              paddingHorizontal: 10,
              borderRadius: 12,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
                fontWeight: 'bold',
                width: '80%',
              }}>
              Receive offers and info on future updates
            </Text>
            <Toggle value={marketing} onValueChange={setMarketing} />
          </TouchableOpacity>
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
            margin: 10,
            marginBottom: 20,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </SafeAreaView>
      <PickerModal
        title="Select prepare time"
        visible={showPrepTime}
        selectedValue={String(prepTime)}
        pickerData={PREP_TIME_SECS.map(value => {
          return {
            label: `${value.toString()} secs`,
            value: String(value),
          };
        })}
        onValueChange={val => setPrepTimeAction(Number(val))}
        onRequestClose={() => setShowPrepTime(false)}
      />
    </View>
  );
};

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  workoutReminders: profile.workoutReminders,
  workoutReminderTime: profile.reminderTime,
  testReminderTime: profile.testReminderTime,
  testReminders: profile.testReminders,
  profile: profile.profile,
  settings,
  autoPlay: profile.autoPlay,
  prepTime: profile.prepTime,
});

const mapDispatchToProps = {
  setWorkoutRemindersAction: setWorkoutReminders,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
  setTestReminderTimeAction: setTestReminderTime,
  setTestRemindersAction: setTestReminders,
  updateProfileAction: updateProfile,
  setAutoPlay,
  setPrepTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
