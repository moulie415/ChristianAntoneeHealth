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
import useInit from './UseInit';

const useWorkoutData = (
  seconds: number,
  profile: Profile,
  difficulty: number,
  endDate: Date,
  setProfileAction: (payload: Profile) => void,
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
  useInit(() => {
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
        if (
          profile.fitbitToken &&
          profile.fitbitUserId &&
          profile.fitbitRefreshToken &&
          profile.fitbitTokenTimestamp &&
          profile.fitbitTokenExpiresIn
        ) {
          let token = profile.fitbitToken;
          if (
            profile.fitbitTokenTimestamp + profile.fitbitTokenExpiresIn <
            moment().unix()
          ) {
            const data = await fitbit.refreshToken(
              profile.uid,
              profile.fitbitRefreshToken,
            );
            if (data) {
              token = data.fitbitToken;
              setProfileAction({...profile, ...data});
            }
          }
          const {samples: fSamples, data} =
            await fitbit.getHeartRateTimeSeriesByDate(
              token,
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
  });

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
