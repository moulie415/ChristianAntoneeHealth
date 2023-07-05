import {Alert, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {CalendarType, MyRootState, Plan} from '../../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import * as _ from 'lodash';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import RNCalendarEvents, {
  CalendarEventWritable,
} from 'react-native-calendar-events';
import Button from '../../commons/Button';
import {logError} from '../../../helpers/error';
import Modal from '../../commons/Modal';
import Text from '../../commons/Text';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import Snackbar from 'react-native-snackbar';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Test from '../../../types/Test';
import Divider from '../../commons/Divider';
import ListItem from '../../commons/ListItem';
import {MarkedDates} from 'react-native-calendars/src/types';
import {navigate} from '../../../RootNavigation';
import {setWorkout} from '../../../actions/exercises';
import Exercise from '../../../types/Exercise';
import {setSyncedPlanEvent} from '../../../actions/plan';

const Monthly: React.FC<{
  plan?: Plan;
  syncedPlanEvents: {[key: string]: string};
  setSyncedPlanEvent: (key: string, id: string) => void;
}> = ({
  plan,
  syncedPlanEvents,
  setSyncedPlanEvent: setSyncedPlanEventAction,
}) => {
  const [calendarList, setCalendarList] = useState<CalendarType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const workoutDates: string[] = plan?.workouts
    ? plan.workouts.reduce((acc: string[], cur) => {
        if (cur.dates) {
          return [...acc, ...cur.dates];
        }
        return acc;
      }, [])
    : [];

  const uniq = _.uniq(workoutDates);

  const dates: MarkedDates = uniq.reduce((acc: MarkedDates, cur) => {
    if (cur) {
      return {
        ...acc,
        [cur]: {
          selected: true,
          selectedColor: colors.appBlue,
        },
      };
    }
    return acc;
  }, {});

  const syncWithCalendar = async (calendarId: string) => {
    try {
      const events: {
        title: string;
        details: CalendarEventWritable;
      }[] = [];

      const keys: string[] = [];

      plan?.workouts?.forEach(workout => {
        workout.dates?.forEach(date => {
          const title = workout.name || 'CA Health Workout';
          const key = `${plan.id}${title}${date}`;
          const currentId = syncedPlanEvents[key];
          const event: {
            title: string;
            details: CalendarEventWritable;
          } = {
            title,
            details: {
              ...(currentId ? {id: currentId} : {}),
              startDate: moment(date).set('hours', 9).toISOString(),
              endDate: moment(date).set('hours', 10).toISOString(),
              calendarId,
            },
          };
          events.push(event);
          keys.push(key);
        });
      });

      for (let i = 0; i < events.length; i++) {
        const key = keys[i];
        const event = events[i];
        let id;
        try {
          id = await RNCalendarEvents.saveEvent(event.title, event.details);
        } catch (e) {
          id = await RNCalendarEvents.saveEvent(
            event.title,
            _.omit(event.details, ['id']),
          );
        }
        setSyncedPlanEventAction(key, id);
      }

      setModalVisible(false);
      Snackbar.show({text: 'Calendar synced successfully'});
    } catch (e) {
      logError(e);
      console.log(e);
      Snackbar.show({text: 'Error syncing calendar'});
    }
  };

  const maxDate = moment(
    Math.max(...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  const minDate = moment(
    Math.min(...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  return (
    <View style={{marginTop: 20, marginHorizontal: 20}}>
      <Calendar
        style={{borderRadius: 10}}
        markedDates={dates}
        minDate={minDate}
        maxDate={maxDate}
        onDayPress={({dateString}) => {
          if (dates[dateString]) {
            const workouts = plan?.workouts?.filter(w => {
              return w.dates.includes(dateString);
            });

            if (workouts) {
              navigate('MonthlyDayView', {workouts, date: dateString});
            }
          }
        }}
      />
      <Button
        text="Sync with native calendar"
        style={{margin: 20}}
        disabled={loading}
        onPress={async () => {
          try {
            setLoading(true);
            const permission = await RNCalendarEvents.requestPermissions();
            if (permission === 'authorized') {
              const calendars = await RNCalendarEvents.findCalendars();
              const list = calendars.filter(c => c.isPrimary);
              setCalendarList(list);
              if (list.length && list.length > 1) {
                setModalVisible(true);
              } else {
                await syncWithCalendar(list[0].id);
              }
            }
          } catch (e) {
            logError(e);
            Snackbar.show({text: 'Error syncing calendar'});
          }
          setLoading(false);
        }}
      />
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: colors.appGrey,
            paddingBottom: 10,
            borderRadius: 10,
            height: 300,
          }}>
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
              fontSize: 20,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Select a calendar to sync with
          </Text>

          <FlatList
            data={calendarList}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ListItem
                style={{
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.appWhite,
                  marginHorizontal: 40,
                }}
                // titleStyle={{color: colors.appGrey}}
                onPress={() => syncWithCalendar(item.id)}
                accessoryLeft={
                  <Icon
                    name="calendar-alt"
                    size={20}
                    style={{margin: 5}}
                    color={colors.appBlue}
                  />
                }
                key={item.id}
                title={item.title}
              />
            )}
            ItemSeparatorComponent={Divider}
          />
        </View>
      </Modal>
      <AbsoluteSpinner loading={loading} />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
  syncedPlanEvents: profile.syncedPlanEvents,
});

const mapDispatchToProps = {
  setSyncedPlanEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(Monthly);
