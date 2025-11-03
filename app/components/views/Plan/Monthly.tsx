import * as _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { View } from 'react-native';
// @TODO replace with expo calendar
// import { Calendar } from 'react-native-calendars';
// import { MarkedDates } from 'react-native-calendars/src/types';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { RootState } from '../../../App';
import { navigate } from '../../../RootNavigation';
import colors from '../../../constants/colors';
import { setWorkout } from '../../../reducers/exercises';
import Exercise from '../../../types/Exercise';
import { Plan } from '../../../types/Shared';
import Divider from '../../commons/Divider';
import WorkoutCard from '../../commons/WorkoutCard';

const Monthly: React.FC<{
  plan?: Plan;
  setWorkout: (workout: Exercise[]) => void;
  exercises: { [key: string]: Exercise };
}> = ({ plan, setWorkout: setWorkoutAction, exercises }) => {
  const [selected, setSelected] = useState(moment().format('YYYY-MM-DD'));
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
          marked: true,
          dotColor: colors.appBlue,
        },
      };
    }
    return acc;
  }, {});

  const workouts = plan?.workouts?.filter(w => {
    return w.dates.includes(selected);
  });

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <Calendar
        style={{ borderRadius: 10 }}
        theme={{
          calendarBackground: colors.appGrey,
          textSectionTitleColor: colors.appWhite,
          monthTextColor: colors.appWhite,
          dayTextColor: colors.appWhite,
          arrowColor: colors.appBlue,
          todayTextColor: colors.appBlue,
          textDisabledColor: colors.textGrey,
        }}
        markedDates={{
          ...dates,
          [selected]: { selected: true, selectedColor: colors.appBlue },
        }}
        onDayPress={({ dateString }) => {
          setSelected(dateString);
        }}
      />
      <Divider style={{ marginTop: 10, marginBottom: 20 }} />
      {plan && (
        <FlatList
          data={workouts || []}
          renderItem={({ item: workout }) => {
            return (
              <WorkoutCard
                plan
                key={workout.name}
                item={workout}
                onPress={() => {
                  setWorkoutAction(
                    workout.exercises.map(e => {
                      return {
                        ...exercises[e.exercise],
                        ...e,
                      };
                    }),
                  );
                  navigate('PreWorkout', {
                    planWorkout: workout,
                    planId: plan.id,
                  });
                }}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const mapStateToProps = ({ profile, exercises }: RootState) => ({
  plan: profile.plan,
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Monthly);
