import {Alert, View} from 'react-native';
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
import DevicePixels from '../../../helpers/DevicePixels';
import Modal from '../../commons/Modal';
import Text from '../../commons/Text';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import Snackbar from 'react-native-snackbar';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Test from '../../../types/Test';
import Divider from '../../commons/Divider';
import ListItem from '../../commons/ListItem';

const Monthly: React.FC<{plan: Plan; tests: {[key: string]: Test}}> = ({
  plan,
  tests,
}) => {
  const [calendarList, setCalendarList] = useState<CalendarType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const workoutDates = plan.workouts
    ? plan.workouts.reduce((acc, cur) => {
        if (cur.dates) {
          return [...acc, ...cur.dates];
        }
        return acc;
      }, [])
    : [];
  const testDates = plan.tests
    ? plan.tests.reduce((acc, cur) => {
        if (cur.dates) {
          return [...acc, ...cur.dates];
        }
        return acc;
      }, [])
    : [];

  const uniq = _.uniq([...workoutDates, ...testDates]);

  const dates = uniq.reduce((acc, cur) => {
    if (cur) {
      return {
        ...acc,
        [cur]: {
          selected: true,
          selectedColor: moment(cur).endOf('day').isBefore(moment())
            ? colors.button
            : colors.appBlue,
        },
      };
    }
  }, {});

  const maxDate = moment(
    Math.max(...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  const minDate = moment().format('YYYY-MM-DD');

  return (
    <View>
      <Calendar
        markedDates={dates}
        maxDate={maxDate}
        minDate={minDate}
        onDayPress={({dateString}) => {
          if (dates[dateString]) {
            const workout = plan.workouts?.find(w => {
              w.dates.includes(dateString);
            });
            const test = plan.tests?.find(t => {
              t.dates.includes(dateString);
            });
          }
        }}
      />
      <Button
        text="Sync with native calendar"
        style={{margin: DevicePixels[20]}}
        onPress={async () => {
          try {
            const permission = await RNCalendarEvents.requestPermissions();
            if (permission === 'authorized') {
              const calendars = await RNCalendarEvents.findCalendars();

              setCalendarList(calendars.filter(c => c.isPrimary));
              setModalVisible(true);
            }
          } catch (e) {
            logError(e);
            Snackbar.show({text: 'Error syncing calendar'});
          }
        }}
      />
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingBottom: DevicePixels[10],
            borderRadius: DevicePixels[10],
          }}>
          <Text style={{textAlign: 'center', padding: DevicePixels[15]}}>
            Select a calendar to sync with
          </Text>
          <Divider />
          <FlatList
            data={calendarList}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ListItem
                onPress={async () => {
                  try {
                    setLoading(true);
                    const events: {
                      title: string;
                      details: CalendarEventWritable;
                    }[] = [];
                    plan.workouts?.forEach(workout => {
                      workout.dates?.forEach(date => {
                        const title = workout.name || 'CA Health Workout';
                        const event: {
                          title: string;
                          details: CalendarEventWritable;
                        } = {
                          title,
                          details: {
                            startDate: moment(date)
                              .set('hours', 9)
                              .toISOString(),
                            endDate: moment(date)
                              .set('hours', 10)
                              .toISOString(),
                            calendarId: item.id,
                            allDay: true,
                          },
                        };
                        events.push(event);
                      });
                    });
                    plan.tests?.forEach(test => {
                      test.dates?.forEach(date => {
                        const testObj = tests[test.test];
                        const title = testObj ? testObj.name : 'CA Health Test';
                        const event: {
                          title: string;
                          details: CalendarEventWritable;
                        } = {
                          title,
                          details: {
                            startDate: moment(date)
                              .set('hours', 9)
                              .toISOString(),
                            endDate: moment(date)
                              .set('hours', 10)
                              .toISOString(),
                            calendarId: item.id,
                            allDay: true,
                          },
                        };
                        events.push(event);
                      });
                    });
                    await Promise.all(
                      events.map(event => {
                        return RNCalendarEvents.saveEvent(
                          event.title,
                          event.details,
                        );
                      }),
                    );

                    setLoading(false);
                    setModalVisible(false);
                    Snackbar.show({text: 'Calendar synced successfully'});
                  } catch (e) {
                    setLoading(false);
                    logError(e);
                    console.log(e);
                    Snackbar.show({text: 'Error syncing calendar'});
                  }
                }}
                accessoryLeft={
                  <Icon
                    name="calendar-alt"
                    size={DevicePixels[20]}
                    style={{margin: DevicePixels[5]}}
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

const mapStateToProps = ({profile, tests}: MyRootState) => ({
  plan: profile.plan,
  tests: tests.tests,
});

export default connect(mapStateToProps)(Monthly);
