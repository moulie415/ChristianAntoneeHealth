import {getCalorieSamples, getHeartRateSamples} from '../helpers/biometrics';
import {
  getCaloriesBurned,
  getCaloriesBurnedFromAverageHeartRate,
} from '../helpers/exercises';
import {
  CalorieCalculationType,
  Profile,
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
  let heartRateSamples = [];
  heartRateSamples = await getHeartRateSamples(startDate, endDate);

  let calorieSamples = [];
  let calories = 0;
  calorieSamples = await getCalorieSamples(startDate, endDate);

  if (calorieSamples.length) {
    calories = calorieSamples.reduce((acc, cur) => acc + cur.value, 0);
  }

  if (watchWorkoutData?.heartRateSamples.length) {
    heartRateSamples = watchWorkoutData.heartRateSamples;
  }

  if (watchWorkoutData?.energySamples.length) {
    calorieSamples = watchWorkoutData.energySamples;
  }

  const averageHeartRate = heartRateSamples.length
    ? heartRateSamples.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0) / heartRateSamples.length
    : 0;

  const caloriesEstimate =
    getCaloriesBurned(seconds, difficulty, profile.weight) || 0;

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

  const calorieCalculationType: CalorieCalculationType = watchWorkoutData
    ?.energySamples.length
    ? 'sample'
    : caloriesFromHeartRate
    ? 'heartRate'
    : 'estimate';

  return {
    heartRateSamples,
    averageHeartRate,
    calorieSamples,
    calorieCalculationType,
    calories: watchWorkoutData?.energySamples.length
      ? calories
      : caloriesFromHeartRate
      ? caloriesFromHeartRate
      : caloriesEstimate,
  };
};
