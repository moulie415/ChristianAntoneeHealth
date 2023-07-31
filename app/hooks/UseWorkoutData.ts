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
import * as polar from '../helpers/polar';
import * as garmin from '../helpers/garmin';
import * as fitbit from '../helpers/fitbit';

const useWorkoutData = (
  seconds: number,
  profile: Profile,
  difficulty: number,
  endDate: Date,
) => {
  const [heartRateSamples, setHeartRateSamples] = useState<Sample[]>([]);
  const [polarHeartRateSamples, setPolarHeartRateSamples] = useState<Sample[]>(
    [],
  );
  const [fitbitHeartRateSamples, setFitbitHeartRateSamples] = useState<
    Sample[]
  >([]);
  const [garminHeartRateSamples, setGarminHeartRateSamples] = useState<
    Sample[]
  >([]);

  const [garminData, setGarminData] =
    useState<garmin.GarminActivityDetailResponse>([]);

  const [fitbitData, setFitbitData] = useState<fitbit.ActivitiesHeart[]>([]);

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
        if (profile.polarAccessToken) {
          const pSamples = await polar.getHeartRateSamples(
            profile.polarAccessToken,
            moment(endDate).subtract(seconds, 'seconds').toDate(),
            endDate,
          );
          setPolarHeartRateSamples(pSamples);
        }
        if (profile.garminAccessToken && profile.garminAccessTokenSecret) {
          const {samples: gSamples, data} = await garmin.getActivityDetails(
            profile.garminAccessToken,
            profile.garminAccessTokenSecret,
            moment(endDate).subtract(seconds, 'seconds').toDate(),
            endDate,
          );
          setGarminHeartRateSamples(gSamples);
          setGarminData(data);
        }
        if (profile.fitbitToken && profile.fitbitUserId) {
          const {samples: fSamples, data} =
            await fitbit.getHeartRateTimeSeriesByDate(
              profile.fitbitToken,
              profile.fitbitUserId,
              moment(endDate).subtract(seconds, 'seconds').toDate(),
              endDate,
            );
          setFitbitData(data);
          setFitbitHeartRateSamples(fSamples);
        }
      } catch (e) {
        logError(e);
      }
      setLoading(false);
    };
    getSamples();
  }, [endDate, seconds, profile]);

  const getValidHeartRateSamples = () => {
    if (polarHeartRateSamples.length) {
      return polarHeartRateSamples;
    }
    if (garminHeartRateSamples.length) {
      return garminHeartRateSamples;
    }

    if (fitbitHeartRateSamples.length) {
      return fitbitHeartRateSamples;
    }
    return heartRateSamples;
  };

  const validHeartRateSamples = getValidHeartRateSamples();

  const averageHeartRate = validHeartRateSamples.length
    ? validHeartRateSamples.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0) / validHeartRateSamples.length
    : 0;

  return {
    loading,
    heartRateSamples: validHeartRateSamples,
    averageHeartRate,
    fitbitData,
    garminData,
    calories:
      validHeartRateSamples &&
      validHeartRateSamples.length &&
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
