import moment from 'moment';
import {useState} from 'react';
import {
  endWatchWorkout,
  getCalorieSamples,
  getHeartRateSamples,
} from '../helpers/biometrics';
import {logError} from '../helpers/error';
import {
  getCaloriesBurned,
  getCaloriesBurnedFromAverageHeartRate,
} from '../helpers/exercises';
import {CalorieCalculationType, Profile, Sample} from '../types/Shared';
import useInit from './UseInit';
const useWorkoutData = (
  seconds: number,
  profile: Profile,
  difficulty: number,
  startDate: Date,
  endDate: Date,
) => {
  const [heartRateSamples, setHeartRateSamples] = useState<Sample[]>([]);
  const [calorieSamples, setCalorieSamples] = useState<Sample[]>([]);

  const [calories, setCalories] = useState(0);

  const [loading, setLoading] = useState(false);

  useInit(() => {
    const getSamples = async () => {
      try {
        setLoading(true);

        const watchData = await endWatchWorkout(startDate);

        const samples =
          watchData?.heartRateSamples ??
          (await getHeartRateSamples(startDate, endDate));

        setHeartRateSamples(samples);

        const cSamples =
          watchData?.energySamples ??
          (await getCalorieSamples(startDate, endDate));

        if (cSamples.length) {
          setCalorieSamples(cSamples);
          setCalories(calorieSamples.reduce((acc, cur) => acc + cur.value, 0));
        }
      } catch (e) {
        logError(e);
      }
      setLoading(false);
    };
    getSamples();
  });

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
    calorieSamplesSpan / seconds >= 0.8 &&
    calories > (caloriesEstimate || 0) / 2;

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
    loading,
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

export default useWorkoutData;
