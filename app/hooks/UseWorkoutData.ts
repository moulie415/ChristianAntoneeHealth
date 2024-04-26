import moment from 'moment';
import {useState} from 'react';
import {getCalorieSamples, getHeartRateSamples} from '../helpers/biometrics';
import {logError} from '../helpers/error';
import {
  getCaloriesBurned,
  getCaloriesBurnedFromAverageHeartRate,
} from '../helpers/exercises';
import * as fitbit from '../helpers/fitbit';
import * as polar from '../helpers/polar';
import {CalorieCalculationType, Profile, Sample} from '../types/Shared';
import useInit from './UseInit';
const useWorkoutData = (
  seconds: number,
  profile: Profile,
  difficulty: number,
  endDate: Date,
  setProfileAction: (payload: Profile) => void,
  currentHeartRateSamples: Sample[],
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

  const [calories, setCalories] = useState(0);

  const [fitbitData, setFitbitData] = useState<fitbit.ActivitiesHeart[]>([]);

  const [loading, setLoading] = useState(false);
  useInit(() => {
    const getSamples = async () => {
      try {
        setLoading(true);

        if (profile.polarAccessToken) {
          const pSamples = await polar.getHeartRateSamples(
            profile.polarAccessToken,
            moment(endDate).subtract(seconds, 'seconds').toDate(),
            endDate,
          );
          setPolarHeartRateSamples(pSamples);
        } else if (
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
        } else {
          const samples = currentHeartRateSamples?.length
            ? currentHeartRateSamples
            : await getHeartRateSamples(
                moment(endDate).subtract(seconds, 'seconds').toDate(),
                endDate,
              );

          setHeartRateSamples(samples);
          const calorieSamples = await getCalorieSamples(
            moment(endDate).subtract(seconds, 'seconds').toDate(),
            endDate,
          );
          if (calorieSamples.length) {
            setCalories(
              calorieSamples.reduce((acc, cur) => acc + cur.value, 0),
            );
          }
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

  const calorieCalculationType: CalorieCalculationType = calories
    ? 'sample'
    : validHeartRateSamples &&
      validHeartRateSamples.length &&
      profile.dob &&
      profile.gender
    ? 'heartRate'
    : 'estimate';

  return {
    loading,
    heartRateSamples: validHeartRateSamples,
    averageHeartRate,
    fitbitData,
    calorieCalculationType,
    calories: calories
      ? calories
      : validHeartRateSamples &&
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
