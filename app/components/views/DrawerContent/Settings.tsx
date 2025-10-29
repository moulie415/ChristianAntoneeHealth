import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import * as _ from 'lodash';
import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// import RNCalendarEvents from 'react-native-calendar-events';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../../App';
import { EQUIPMENT_LIST, PREP_TIME_SECS } from '../../../constants';
import colors from '../../../constants/colors';
import { logError } from '../../../helpers/error';
import { equipmentItemReadableString } from '../../../helpers/exercises';
import { getGoalReadableString } from '../../../helpers/goals';
import {
  setCalendarId,
  syncPlanWithCalendar,
  updateProfile,
} from '../../../reducers/profile';
import {
  CalendarType,
  Goal,
  Plan,
  Profile,
  UpdateProfilePayload,
} from '../../../types/Shared';
import Button from '../../commons/Button';
import Divider from '../../commons/Divider';
import Header from '../../commons/Header';
import ListItem from '../../commons/ListItem';
import Modal from '../../commons/Modal';
import MultiSelect from '../../commons/MultiSelect';
import PickerModal from '../../commons/PickerModal';
import Text from '../../commons/Text';
import Toggle from '../../commons/Toggle';
import SelectGoalModal from './SelectGoalModal';

const SettingsItem: React.FC<{
  onPress: () => void;
  text: string;
  right?: ReactNode;
  disabled?: boolean;
}> = ({ onPress, text, right, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
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
      }}
    >
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 13,
          fontWeight: 'bold',
        }}
      >
        {text}
      </Text>
      {right}
    </TouchableOpacity>
  );
};

const Settings: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  plan?: Plan;
  syncPlanWithCalendarAction: ({
    plan,
    sync,
  }: {
    plan: Plan;
    sync: boolean;
  }) => void;
  setCalendarId: (id: string) => void;
}> = ({
  profile,
  navigation,
  updateProfileAction,
  plan,
  syncPlanWithCalendarAction,
  setCalendarId: setCalendarIdAction,
}) => {
  const [showWorkoutDate, setShowWorkoutDate] = useState(false);
  const [workoutReminderTime, setWorkoutReminderTime] = useState(
    profile.workoutReminderTime,
  );

  const [marketing, setMarketing] = useState(profile.marketing);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<Goal>(profile.goal || Goal.STRENGTH);
  const [showPrepTime, setShowPrepTime] = useState(false);
  const [calendarList, setCalendarList] = useState<CalendarType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [autoPlay, setAutoPlay] = useState(profile.autoPlay);
  const [prepTime, setPrepTime] = useState(profile.prepTime);
  const [workoutMusic, setWorkoutMusic] = useState(profile.workoutMusic);
  const [workoutReminders, setWorkoutReminders] = useState(
    profile.workoutReminders,
  );

  const [goalReminders, setGoalReminders] = useState(profile.goalReminders);
  const [syncPlan, setSyncPlanWithCalendar] = useState(
    profile.syncPlanWithCalendar,
  );
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const [optedInToLeaderboards, setOptedInToLeaderboards] = useState(
    profile.optedInToLeaderboards,
  );

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [equipmentList, setEquipmentList] = useState(profile.equipmentList);

  const newProfile = {
    ...profile,
    goal,
    marketing,
    autoPlay,
    prepTime,
    workoutMusic,
    workoutReminderTime,
    goalReminders,
    workoutReminders,
    syncPlanWithCalendar: syncPlan,
    ...(optedInToLeaderboards !== undefined ? { optedInToLeaderboards } : {}),
    ...(equipmentList !== undefined ? { equipmentList } : {}),
  };

  const equal = _.isEqual(newProfile, profile);

  const toggle = async (sync: boolean) => {
    try {
      if (plan) {
        if (sync) {
          // const permission = await RNCalendarEvents.requestPermissions();
          // if (permission === 'authorized') {
          //   const calendars = await RNCalendarEvents.findCalendars();
          //   const list = calendars.filter(c => c.isPrimary);
          //   setCalendarList(list);
          //   if (list.length && list.length > 1) {
          //     setModalVisible(true);
          //   } else {
          //     setCalendarIdAction(list[0].id);
          //     syncPlanWithCalendarAction({ plan, sync });
          //     setSyncPlanWithCalendar(sync);
          //   }
          // }
        } else {
          syncPlanWithCalendarAction({ plan, sync });
          setSyncPlanWithCalendar(sync);
        }
      }
    } catch (e) {
      logError(e);
      Snackbar.show({ text: 'Error syncing calendar' });
    }
  };

  useEffect(() => {
    const user = auth().currentUser;
    if (user?.providerData?.find(data => data.providerId === 'password')) {
      setShowChangePassword(true);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.appGrey }}>
      <SafeAreaView>
        <Header hasBack title="Settings" />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          <Text
            style={{
              margin: 10,
              fontSize: 18,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}
          >
            Workouts
          </Text>
          <SettingsItem
            onPress={() => setAutoPlay(!autoPlay)}
            text="Auto-play"
            right={<Toggle value={autoPlay} onValueChange={setAutoPlay} />}
          />
          <SettingsItem
            onPress={() => setShowPrepTime(true)}
            text="Exercise prepare time"
            right={
              <Text
                style={{
                  fontSize: 13,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                }}
              >
                {`${prepTime} secs`}
              </Text>
            }
          />
          <SettingsItem
            onPress={() => setWorkoutMusic(!workoutMusic)}
            text="Workout music"
            right={
              <Toggle value={workoutMusic} onValueChange={setWorkoutMusic} />
            }
          />

          <SettingsItem
            disabled={!plan}
            onPress={() => toggle(!syncPlan)}
            text="Sync custom plans with native calendar"
            right={
              <Toggle
                disabled={!plan}
                value={syncPlan}
                onValueChange={toggle}
              />
            }
          />

          <SettingsItem
            onPress={() => setGoalModalVisible(true)}
            text="Goal"
            right={
              <Text
                style={{
                  fontSize: 13,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                }}
              >
                {getGoalReadableString(goal)}
              </Text>
            }
          />
          <View style={{ margin: 10 }}>
            <MultiSelect
              items={EQUIPMENT_LIST.map(item => {
                return { id: item, name: equipmentItemReadableString(item) };
              })}
              selectedItems={equipmentList}
              onSelectedItemsChange={setEquipmentList}
              selectText="Equipment list"
            />
          </View>
          <Text
            style={{
              margin: 10,
              marginTop: 35,
              fontSize: 18,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}
          >
            Notifications
          </Text>

          <SettingsItem
            onPress={() => setWorkoutReminders(!workoutReminders)}
            text="Workout reminders"
            right={
              <Toggle
                value={workoutReminders}
                onValueChange={setWorkoutReminders}
              />
            }
          />

          <SettingsItem
            onPress={() => setShowWorkoutDate(true)}
            disabled={Platform.OS === 'ios'}
            text="Time of workout reminder"
            right={
              <>
                {(showWorkoutDate || Platform.OS === 'ios') && (
                  <DateTimePicker
                    disabled={!workoutReminders}
                    style={{ width: 150 }}
                    testID="time"
                    value={new Date(workoutReminderTime || '')}
                    textColor={colors.appWhite}
                    // placeholderText="Select date"
                    mode="time"
                    // is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, d: Date | undefined) => {
                      if (d) {
                        setWorkoutReminderTime(d.toISOString());
                      }
                      setShowWorkoutDate(Platform.OS === 'ios');
                    }}
                  />
                )}
                {Platform.OS === 'android' && (
                  <TouchableOpacity
                    disabled={!workoutReminders}
                    onPress={() => setShowWorkoutDate(true)}
                  >
                    <Text
                      style={{ color: colors.appWhite, fontWeight: 'bold' }}
                    >
                      {moment(workoutReminderTime).format('HH:mm')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            }
          />

          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 12,
              color: colors.appWhite,
              marginLeft: 10,
            }}
          >
            Please note the above reminders are for custom plans only
          </Text>

          <SettingsItem
            onPress={() => setGoalReminders(!goalReminders)}
            text="Goal reminders"
            right={
              <Toggle value={goalReminders} onValueChange={setGoalReminders} />
            }
          />

          <Text
            style={{
              margin: 10,
              marginTop: 35,
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            Emails
          </Text>

          <SettingsItem
            onPress={() => setMarketing(!marketing)}
            text="Receive offers and info on future updates"
            right={<Toggle value={marketing} onValueChange={setMarketing} />}
          />
          <Text
            style={{
              margin: 10,
              marginTop: 35,
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            Account
          </Text>

          <SettingsItem
            onPress={async () => {
              await Clipboard.setStringAsync(profile.uid);
              Snackbar.show({ text: 'User ID copied to clipboard' });
            }}
            text="User ID"
            right={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.appWhite, fontSize: 12 }}>
                  {profile.uid}
                </Text>
                <FontAwesome6
                  name="copy"
                  style={{ marginLeft: 10 }}
                  color={colors.appBlue}
                  size={18}
                  iconStyle="solid"
                />
              </View>
            }
          />

          <SettingsItem
            disabled
            onPress={() => {}}
            text="Email"
            right={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.appWhite, fontSize: 12 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.appWhite,
                      fontWeight: 'bold',
                    }}
                  >
                    {profile.email}
                  </Text>
                </Text>
              </View>
            }
          />

          {!!profile.premium && (
            <>
              <Text
                style={{
                  margin: 10,
                  marginTop: 35,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
              >
                Leaderboards
              </Text>

              <SettingsItem
                onPress={() => setOptedInToLeaderboards(!optedInToLeaderboards)}
                text="Opt in to leaderboards"
                right={
                  <Toggle
                    value={optedInToLeaderboards}
                    onValueChange={setOptedInToLeaderboards}
                  />
                }
              />
            </>
          )}

          {showChangePassword && (
            <Button
              variant="secondary"
              text="Change password"
              style={{ margin: 10 }}
              onPress={() => navigation.navigate('ChangePassword')}
            />
          )}

          <Button
            variant="danger"
            text=" Delete my account"
            style={{ margin: 10 }}
            onPress={() => navigation.navigate('DeleteAccount')}
          />
        </ScrollView>
      </SafeAreaView>
      <Button
        onPress={() => {
          setLoading(true);
          navigation.goBack();
          updateProfileAction(newProfile);
        }}
        text="Save"
        disabled={equal || loading}
        style={{
          marginHorizontal: 10,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 30,
        }}
      />
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
        onValueChange={({ item }) => setPrepTime(Number(item.value))}
        onRequestClose={() => setShowPrepTime(false)}
      />
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            backgroundColor: colors.appGrey,
            paddingBottom: 10,
            borderRadius: 10,
            height: 300,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
              fontSize: 20,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}
          >
            Select a calendar to sync with
          </Text>

          {plan && (
            <FlatList
              data={calendarList}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ListItem
                  style={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.appWhite,
                    marginHorizontal: 40,
                  }}
                  // titleStyle={{color: colors.appGrey}}
                  onPress={() => {
                    setModalVisible(false);
                    setCalendarIdAction(item.id);
                    syncPlanWithCalendarAction({ plan, sync: true });
                  }}
                  accessoryLeft={
                    <FontAwesome6
                      name="calendar-days"
                      size={20}
                      style={{ margin: 5 }}
                      color={colors.appBlue}
                    />
                  }
                  key={item.id}
                  title={item.title}
                />
              )}
              ItemSeparatorComponent={Divider}
            />
          )}
        </View>
      </Modal>
      <SelectGoalModal
        goalModalVisible={goalModalVisible}
        setGoalModalVisible={setGoalModalVisible}
        goal={goal}
        setGoal={setGoal}
      />
    </View>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
  syncedPlanEvents: profile.syncedPlanEvents,
  plan: profile.plan,
});

const mapDispatchToProps = {
  updateProfileAction: updateProfile,
  setCalendarId,
  syncPlanWithCalendarAction: syncPlanWithCalendar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
