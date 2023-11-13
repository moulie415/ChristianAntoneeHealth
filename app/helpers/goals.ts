import {WeeklyItems} from '../reducers/profile';
import Profile from '../types/Profile';
import QuickRoutine from '../types/QuickRoutines';
import {Goal, Level, PlanWorkout} from '../types/Shared';

export const getWorkoutLevelTitleString = (profile: Profile) => {
  return profile.goal === Goal.WEIGHT_LOSS
    ? 'Intermediate'
    : profile.goal === Goal.STRENGTH
    ? 'Intermediate'
    : 'Beginner';
};

interface GenericWorkout {
  level: Level;
}

const contributesToScore = <Type extends GenericWorkout>(
  profile: Profile,
  workout: Type,
) => {
  if (profile.goal === Goal.WEIGHT_LOSS) {
    return workout.level === Level.INTERMEDIATE;
  }
  if (profile.goal === Goal.STRENGTH) {
    return (
      workout.level === Level.INTERMEDIATE || workout.level === Level.ADVANCED
    );
  }
  return (
    workout.level === Level.BEGINNER || workout.level === Level.INTERMEDIATE
  );
};

export const getGoalsData = (
  profile: Profile,
  weeklyItems: WeeklyItems,
  quickRoutinesObj: {[key: string]: QuickRoutine},
) => {
  const workoutGoal = profile.goal === Goal.STRENGTH ? 4 : 3;
  const minsGoal = profile.goal === Goal.WEIGHT_LOSS ? 180 : 150;

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

  console.log(planWorkouts.map(w => w.level))

  const workoutLevelScore =
    (quickRoutines
      ? quickRoutines?.filter(routine => contributesToScore(profile, routine))
          .length
      : 0) +
    planWorkouts.filter(workout => contributesToScore(profile, workout)).length;

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
  const workoutsCompleted = [...savedWorkouts, ...savedQuickRoutines].length;
  return {
    calories,
    mins,
    workoutLevelScore,
    workoutGoal,
    minsGoal,
    workoutsCompleted,
  };
};
