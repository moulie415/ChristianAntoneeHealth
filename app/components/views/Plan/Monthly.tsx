import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
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
import {
  setCalendarId,
  setSyncedPlanEvent,
  syncPlanWithCalendar,
} from '../../../actions/plan';
import Toggle from '../../commons/Toggle';

const Monthly: React.FC<{
  plan?: Plan;
  syncPlanWithCalendar: boolean;
  syncPlanWithCalendarAction: (plan: Plan, sync: boolean) => void;
  setCalendarId: (id: string) => void;
}> = ({
  plan,
  syncPlanWithCalendar: syncWithCalendar,
  syncPlanWithCalendarAction,
  setCalendarId: setCalendarIdAction,
}) => {
  const [calendarList, setCalendarList] = useState<CalendarType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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

  const maxDate = moment(
    Math.max(...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  const minDate = moment(
    Math.min(...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  const toggle = async (sync: boolean) => {
    try {
      if (plan) {
        if (sync) {
          const permission = await RNCalendarEvents.requestPermissions();
          if (permission === 'authorized') {
            const calendars = await RNCalendarEvents.findCalendars();
            const list = calendars.filter(c => c.isPrimary);
            setCalendarList(list);
            if (list.length && list.length > 1) {
              setModalVisible(true);
            } else {
              setCalendarIdAction(list[0].id);
              syncPlanWithCalendarAction(plan, sync);
            }
          }
        } else {
          syncPlanWithCalendarAction(plan, sync);
        }
      }
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'Error syncing calendar'});
    }
  };

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
      <TouchableOpacity
        onPress={() => {
          toggle(!syncWithCalendar);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
          height: 60,
          paddingHorizontal: 10,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Sync with native calendar
        </Text>
        {plan && <Toggle value={syncWithCalendar} onValueChange={toggle} />}
      </TouchableOpacity>
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

          {plan && (
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
                  onPress={() => {
                    setModalVisible(false);
                    setCalendarIdAction(item.id);
                    syncPlanWithCalendarAction(plan, true);
                  }}
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
          )}
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
  syncedPlanEvents: profile.syncedPlanEvents,
  syncPlanWithCalendar: profile.syncPlanWithCalendar,
});

const mapDispatchToProps = {
  setCalendarId,
  syncPlanWithCalendarAction: syncPlanWithCalendar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Monthly);
