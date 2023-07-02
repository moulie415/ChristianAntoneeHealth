import {useEffect, useState} from 'react';
import Profile from '../types/Profile';
import {getHeartRateSamples} from '../helpers/biometrics';
import moment from 'moment';
import {Sample} from '../types/Shared';
import {logError} from '../helpers/error';
import {
  getCaloriesBurned,
  getCaloriesBurnedFromAverageHeartRate,
} from '../helpers/exercises';

const useWorkoutData = (
  seconds: number,
  profile: Profile,
  difficulty: number,
  endDate: Date,
) => {
  console.log(endDate);
  const [heartRateSamples, setHeartRateSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getSamples = async () => {
      try {
        setLoading(true);
        const samples = await getHeartRateSamples(
          moment(endDate).subtract(seconds, 'seconds').toDate(),
          endDate,
        );
        setHeartRateSamples(
          samples.map(({startDate, endDate: e, value}) => {
            return {startDate, endDate: e, value};
          }),
        );
      } catch (e) {
        logError(e);
      }
      setLoading(false);
    };
    getSamples();
  }, [endDate, seconds]);

  const averageHeartRate =
    heartRateSamples.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0) / heartRateSamples.length;

  return {
    loading,
    heartRateSamples,
    averageHeartRate,
    calories:
      heartRateSamples &&
      heartRateSamples.length &&
      profile.dob &&
      profile.gender
        ? getCaloriesBurnedFromAverageHeartRate(
            seconds,
            averageHeartRate,
            profile.dob,
            profile.weight,
            profile.gender,
          )
        : getCaloriesBurned(seconds, difficulty, profile.weight),
  };
};

export default useWorkoutData;
