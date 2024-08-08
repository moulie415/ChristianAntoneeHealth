import moment from 'moment';
import {getCalorieSamples, getHeartRateSamples} from '../helpers/biometrics';
import {
  getCaloriesBurned,
  getCaloriesBurnedFromAverageHeartRate,
} from '../helpers/exercises';
import {
  CalorieCalculationType,
  Profile,
  Sample,
  WatchWorkoutResponse,
} from '../types/Shared';
export const getWorkoutData = async (
  seconds: number,
  profile: Profile,
  difficulty: number,
  startDate: Date,
  endDate: Date,
  watchWorkoutData?: WatchWorkoutResponse,
) => {
  let heartRateSamples: Sample[] = [];
  heartRateSamples = await getHeartRateSamples(startDate, endDate);

  let calorieSamples: Sample[] = [];
  let calories = 0;
  calorieSamples = await getCalorieSamples(startDate, endDate);

  if (watchWorkoutData?.heartRateSamples.length) {
    heartRateSamples = watchWorkoutData.heartRateSamples;
  }

  if (watchWorkoutData?.energySamples.length) {
    calorieSamples = watchWorkoutData.energySamples;
  }

  if (calorieSamples.length) {
    calories = calorieSamples.reduce((acc, cur) => acc + cur.value, 0);
  }

  const averageHeartRate = heartRateSamples.length
    ? heartRateSamples.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0) / heartRateSamples.length
    : 0;

  const calorieSamplesSpan = Math.abs(
    calorieSamples.reduce((acc, cur) => {
      const start = moment(cur.startDate);
      const end = moment(cur.endDate);
      const diff = start.diff(end, 'seconds');
      return acc + diff;
    }, 0),
  );

  const caloriesEstimate =
    getCaloriesBurned(seconds, difficulty, profile.weight) || 0;

  const shouldUseCalorieSamples =
    !!watchWorkoutData?.energySamples.length ||
    (calorieSamplesSpan / seconds >= 0.8 &&
      calories > (caloriesEstimate || 0) / 2);

  const caloriesFromHeartRate =
    heartRateSamples && heartRateSamples.length && profile.dob && profile.gender
      ? getCaloriesBurnedFromAverageHeartRate(
          seconds,
          averageHeartRate,
          profile.dob,
          profile.weight,
          profile.gender,
        ) || 0
      : 0;

  const calorieCalculationType: CalorieCalculationType = shouldUseCalorieSamples
    ? 'sample'
    : caloriesFromHeartRate
    ? 'heartRate'
    : 'estimate';

  return {
    heartRateSamples,
    averageHeartRate,
    calorieSamples,
    calorieCalculationType,
    calories: shouldUseCalorieSamples
      ? calories
      : caloriesFromHeartRate
      ? caloriesFromHeartRate
      : caloriesEstimate,
  };
};
