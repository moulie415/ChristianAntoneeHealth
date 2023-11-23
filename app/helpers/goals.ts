import {capitalizeFirstLetter} from '.';
import {SaveWorkoutAction} from '../actions/exercises';
import {SaveQuickRoutineAction} from '../actions/quickRoutines';
import {WeeklyItems} from '../reducers/profile';
import {SettingsState} from '../reducers/settings';
import Profile from '../types/Profile';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine, SavedWorkout} from '../types/SavedItem';
import {Goal, Level, PlanWorkout} from '../types/Shared';

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
  goal: Goal,
  weeklyItems: WeeklyItems,
  quickRoutinesObj: {[key: string]: QuickRoutine},
  settings: SettingsState,
) => {
  const goalData = settings.workoutGoals[goal];
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

  const calories = [...savedWorkouts, ...savedQuickRoutines].reduce(
    (acc, cur) => {
      return acc + (cur.calories || 0);
    },
    0,
  );
  return {
    calories,
    mins,
    workoutLevelScore,
    workoutGoal,
    minsGoal,
    workoutLevelTitleString,
    caloriesGoal,
    workoutLevel: goalData?.workouts.level,
  };
};

export const sendGoalTargetNotification = (
  payload: SavedWorkout | SavedQuickRoutine,
  goal: Goal,
  weeklyItems: WeeklyItems,
  quickRoutines: {[key: string]: QuickRoutine},
  settings: SettingsState,
) => {
  const {
    calories,
    mins,
    workoutLevelScore,
    workoutGoal,
    minsGoal,
    caloriesGoal,
    workoutLevel,
  } = getGoalsData(goal, weeklyItems, quickRoutines, settings);

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
      // check if they've now met all the targets
      if (
        newWorkoutLevelScore >= workoutGoal &&
        newCalories >= caloriesGoal &&
        newMins >= minsGoal
      ) {
        // well done you've met all your targets for this week!
        return;
      }
      // Otherwise check individual targets
      if (
        workoutLevelScore < workoutGoal &&
        newWorkoutLevelScore >= workoutGoal
      ) {
        return;
      }

      if (calories < caloriesGoal && newCalories >= caloriesGoal) {
        return;
      }
      if (mins < minsGoal && newMins >= caloriesGoal) {
        return;
      }
    }
  }
};
