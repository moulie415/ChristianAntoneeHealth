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
import SettingsProps from '../../types/views/Settings';
import {Goal, MyRootState, Purpose} from '../../types/Shared';
import {
  setMonthlyTestReminders,
  setWorkoutReminders,
  setWorkoutReminderTime,
  updateProfile,
} from '../../actions/profile';
import {connect} from 'react-redux';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import {purposeItems} from '../../constants';
import {equals} from 'ramda';
import DevicePixels from '../../helpers/DevicePixels';

const Settings: React.FC<SettingsProps> = ({
  workoutReminders,
  setWorkoutRemindersAction,
  workoutReminderTime,
  setWorkoutReminderTimeAction,
  monthlyTestReminders,
  setMonthlyTestRemindersAction,
  profile,
  navigation,
  updateProfileAction,
}) => {
  const [show, setShow] = useState(false);
  const [goalReminder, setGoalReminder] = useState(true);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(
    profile.goals || [],
  );
  const [workoutFrequency, setWorkoutFrequency] = useState(
    profile.workoutFrequency || 1,
  );
  const [purpose, setPurpose] = useState<Purpose>(profile.purpose);

  const selectGoal = (goal: Goal) => {
    selectedGoals.includes(goal)
      ? setSelectedGoals(selectedGoals.filter(t => t !== goal))
      : setSelectedGoals([...selectedGoals, goal]);
  };
  const CheckIcon = ({goal}: {goal: Goal}) => {
    return selectedGoals.includes(goal) ? (
      <Icon name="check" size={DevicePixels[12]} style={{color: '#fff'}} />
    ) : null;
  };
  const CrossIcon = ({goal}: {goal: Goal}) => {
    return selectedGoals.includes(goal) ? (
      <Icon name="times" size={DevicePixels[12]} />
    ) : null;
  };

  const newProfile = {
    ...profile,
    goals: selectedGoals,
    workoutFrequency,
    purpose,
  };

  const equal = equals(newProfile, profile);
  return (
    <Layout style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        <Text style={{margin: DevicePixels[10]}} category="h5">
          Notifications
        </Text>
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
              disabled={!workoutReminders}
              style={{width: DevicePixels[100]}}
              testID="dateTimePicker"
              value={new Date(workoutReminderTime)}
              // placeholderText="Select date"
              mode="time"
              // is24Hour={true}
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={(_: Event, d: Date) => {
                if (d) {
                  setWorkoutReminderTimeAction(d);
                }
                setShow(Platform.OS === 'ios');
              }}
            />
          )}
          {Platform.OS === 'android' && (
            <TouchableOpacity onPress={() => setShow(true)}>
              <Text>{moment(workoutReminderTime).format('HH:mm')}</Text>
            </TouchableOpacity>
          )}
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: DevicePixels[10],
          }}>
          <Text>Monthly Fitness test reminder</Text>
          <Toggle
            checked={monthlyTestReminders}
            onChange={setMonthlyTestRemindersAction}
          />
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: DevicePixels[10],
          }}>
          <Text>Close to goal reminders</Text>
          <Toggle checked={goalReminder} onChange={setGoalReminder} />
        </Layout>
        <Divider />
        <Text style={{margin: DevicePixels[10]}} category="h5">
          Goal Tracking
        </Text>
        <Layout style={{margin: DevicePixels[10]}}>
          <Text
            style={{
              marginTop: DevicePixels[30],
              marginBottom: DevicePixels[10],
            }}>
            What is your main purpose for using this app?
          </Text>
          <Select
            value={
              purpose
                ? purposeItems.find(item => item.purpose === purpose).title
                : ' '
            }
            onSelect={index => {
              if ('row' in index) {
                setPurpose(purposeItems[index.row].purpose);
              }
            }}
            selectedIndex={
              new IndexPath(
                purposeItems.findIndex(item => item.purpose === purpose),
              )
            }>
            {purposeItems.map(item => {
              return (
                <SelectItem
                  key={item.purpose}
                  selected={item.purpose === purpose}
                  title={item.title}
                />
              );
            })}
          </Select>
          <Text
            style={{
              marginTop: DevicePixels[30],
              marginBottom: DevicePixels[10],
            }}>
            What is your main purpose for using this app?
          </Text>

          <Layout
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}>
            <Button
              size="tiny"
              accessoryLeft={() => <CheckIcon goal={Goal.STRENGTH} />}
              accessoryRight={() => <CrossIcon goal={Goal.STRENGTH} />}
              onPress={() => selectGoal(Goal.STRENGTH)}
              status={
                selectedGoals.includes(Goal.STRENGTH) ? 'primary' : 'basic'
              }
              style={{
                width: DevicePixels[120],
                marginBottom: DevicePixels[20],
              }}>
              Strength
            </Button>
            <Button
              size="tiny"
              accessoryLeft={() => <CheckIcon goal={Goal.CARDIO} />}
              accessoryRight={() => <CrossIcon goal={Goal.CARDIO} />}
              onPress={() => selectGoal(Goal.CARDIO)}
              status={selectedGoals.includes(Goal.CARDIO) ? 'primary' : 'basic'}
              style={{
                width: DevicePixels[120],
                marginBottom: DevicePixels[20],
              }}>
              Cardiovascular
            </Button>
          </Layout>
          <Text
            style={{
              marginTop: DevicePixels[30],
              marginBottom: DevicePixels[20],
            }}>
            How many times a week do you want to workout?
          </Text>
          <Layout
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: DevicePixels[10],
            }}>
            <TouchableOpacity
              onPress={() => {
                if (workoutFrequency > 1) {
                  setWorkoutFrequency(workoutFrequency - 1);
                }
              }}>
              <Icon
                name="minus"
                color={colors.appBlue}
                size={DevicePixels[25]}
              />
            </TouchableOpacity>
            <Input
              style={{
                marginHorizontal: DevicePixels[10],
                width: DevicePixels[70],
              }}
              textAlign="center"
              keyboardType="numeric"
              returnKeyType="done"
              value={workoutFrequency.toString()}
              onChangeText={text => {
                if (!isNaN(Number(text))) {
                  setWorkoutFrequency(Number(text.replace(/[^0-9]/g, '')));
                }
                if (!text) {
                  setWorkoutFrequency(1);
                }
              }}
            />
            <TouchableOpacity
              onPress={() => setWorkoutFrequency(workoutFrequency + 1)}>
              <Icon
                name="plus"
                color={colors.appBlue}
                size={DevicePixels[25]}
              />
            </TouchableOpacity>
          </Layout>
        </Layout>
      </ScrollView>
      <Button
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
      </Button>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  workoutReminders: profile.workoutReminders,
  workoutReminderTime: profile.workoutReminderTime,
  monthlyTestReminders: profile.monthlyTestReminders,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutRemindersAction: setWorkoutReminders,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
  setMonthlyTestRemindersAction: setMonthlyTestReminders,
  updateProfileAction: updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
