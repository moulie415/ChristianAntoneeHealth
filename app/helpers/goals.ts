import PushNotification from 'react-native-push-notification';
import {capitalizeFirstLetter} from '.';
import {WeeklyItems} from '../reducers/profile';
import {GOALS_CHANNEL_ID} from '../sagas/profile';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine, SavedWorkout} from '../types/SavedItem';
import {Goal, Level, PlanWorkout, Profile, Targets} from '../types/Shared';

interface GenericWorkout {
  level: Level;
}

export const contributesToScore = <Type extends GenericWorkout>(
  workout: Type,
  goalLevel?: Level,
) => {
  if (!goalLevel || goalLevel === Level.BEGINNER) {
    return true;
  }
  if (goalLevel) {
    if (goalLevel === Level.INTERMEDIATE) {
      return (
        workout.level === Level.INTERMEDIATE || workout.level === Level.ADVANCED
      );
    }
    if (goalLevel === Level.ADVANCED) {
      return workout.level === Level.ADVANCED;
    }
  }
  return false;
};

export const getGoalsData = (
  weeklyItems: WeeklyItems,
  quickRoutinesObj: {[key: string]: QuickRoutine},
  goalData?: Targets,
) => {
  const workoutGoal = goalData?.workouts.number || 0;
  const minsGoal = goalData?.mins || 0;
  const workoutLevelTitleString = capitalizeFirstLetter(
    goalData?.workouts.level || '',
  );
  const caloriesGoal = goalData?.calories || 0;

  const savedWorkouts = weeklyItems?.workouts
    ? Object.values(weeklyItems.workouts)
    : [];

  const savedQuickRoutines = weeklyItems?.quickRoutines
    ? Object.values(weeklyItems.quickRoutines)
    : [];

  const quickRoutines =
    savedQuickRoutines &&
    savedQuickRoutines
      .map(({quickRoutineId}) => {
        return quickRoutinesObj[quickRoutineId];
      })
      .filter(x => x);

  const planWorkouts: PlanWorkout[] = [];

  savedWorkouts.forEach(w => {
    if (w.planWorkout) {
      planWorkouts.push(w.planWorkout);
    }
  });

  const workoutLevelScore =
    (quickRoutines
      ? quickRoutines?.filter(routine =>
          contributesToScore(routine, goalData?.workouts.level),
        ).length
      : 0) +
    planWorkouts.filter(workout =>
      contributesToScore(workout, goalData?.workouts.level),
    ).length;

  const mins = Math.round(
    [...savedWorkouts, ...savedQuickRoutines].reduce((acc, cur) => {
      return acc + cur.seconds / 60;
    }, 0),
  );

  const calories = Math.round(
    [...savedWorkouts, ...savedQuickRoutines].reduce((acc, cur) => {
      return acc + (cur.calories || 0);
    }, 0),
  );
  const completed =
    calories >= caloriesGoal &&
    mins >= minsGoal &&
    workoutLevelScore >= workoutGoal;
  return {
    calories,
    mins,
    workoutLevelScore,
    workoutGoal,
    minsGoal,
    workoutLevelTitleString,
    caloriesGoal,
    workoutLevel: goalData?.workouts.level,
    completed,
  };
};

export const sendGoalTargetNotification = (
  payload: SavedWorkout | SavedQuickRoutine,
  weeklyItems: WeeklyItems,
  quickRoutines: {[key: string]: QuickRoutine},
  profile: Profile,
) => {
  const {
    calories,
    mins,
    workoutLevelScore,
    workoutGoal,
    minsGoal,
    caloriesGoal,
    workoutLevel,
  } = getGoalsData(weeklyItems, quickRoutines, profile.targets);

  const workout: PlanWorkout | QuickRoutine | undefined =
    'quickRoutineId' in payload
      ? quickRoutines[payload.quickRoutineId]
      : payload.planWorkout;
  if (workout) {
    const newWorkoutLevelScore = contributesToScore(workout, workoutLevel)
      ? workoutLevelScore + 1
      : workoutLevelScore;

    const newCalories = calories + (payload.calories || 0);
    const newMins = mins + payload.seconds / 60;

    // check if any of the current targets haven't been met
    if (
      calories < caloriesGoal ||
      mins < minsGoal ||
      workoutLevelScore < workoutGoal
    ) {
      let completed = 0;
      // check if they've now met all the targets
      if (
        newWorkoutLevelScore >= workoutGoal &&
        newCalories >= caloriesGoal &&
        newMins >= minsGoal
      ) {
        PushNotification.localNotification({
          title: 'Weekly targets complete!',
          message:
            'Congratulations you’ve hit all of your targets for this week! Keep up the good work and you’ll reach your end goal in no time!',
          channelId: GOALS_CHANNEL_ID,
        });
        return;
      }
      // Otherwise check individual targets
      if (
        workoutLevelScore < workoutGoal &&
        newWorkoutLevelScore >= workoutGoal
      ) {
        completed += 1;
      }

      if (calories < caloriesGoal && newCalories >= caloriesGoal) {
        completed += 1;
      }
      if (mins < minsGoal && newMins >= caloriesGoal) {
        completed += 1;
      }
      if (completed > 0) {
        PushNotification.localNotification({
          title: 'Well done!',
          message: `you’ve completed ${completed} of your weekly targets! Only ${
            3 - completed
          } more to go!`,
          channelId: GOALS_CHANNEL_ID,
        });
      }
    }
  }
};

export const getGoalReadableString = (goal: Goal) => {
  switch (goal) {
    case Goal.STRENGTH:
      return 'Improve strength & fitness';
    case Goal.ACTIVE:
      return 'Become more active';
    case Goal.WEIGHT_LOSS:
      return 'Weight loss';
    case Goal.OTHER:
      return 'Other';
    default:
      return '';
  }
};
