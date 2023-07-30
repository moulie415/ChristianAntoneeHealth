import moment from 'moment';
import {logError} from './error';
import {Sample} from '../types/Shared';
import Snackbar from 'react-native-snackbar';
import Config from 'react-native-config';
import axios from 'axios';

const makeRequest = async (url: string, token: string) => {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log(url, headers);
  const response = await fetch(url, {headers});
  return response.json();
};

interface GarminActivityDetail {
  userId: string;
  summaryId: string;
  activityId: number;
  summary: {
    userId: string;
    summaryId: string;
    activityId: number;
    activityName: string;
    activityDescription: string;
    isParent: boolean;
    parentSummaryId: string;
    durationInSeconds: number;
    startTimeInSeconds: number;
    startTimeOffsetInSeconds: number;
    activityType: string;
    averageBikeCadenceInRoundsPerMinute: number;
    averageHeartRateInBeatsPerMinute: number;
    averageRunCadenceInStepsPerMinute: number;
    averagePushCadenceInStrokesPerMinute: number;
    averageSpeedInMetersPerSecond: number;
    averageSwimCadenceInStrokesPerMinute: number;
    averagePaceInMinutesPerKilometer: number;
    activeKilocalories: number;
    deviceName: string;
    distanceInMeters: number;
    maxBikeCadenceInRoundsPerMinute: number;
    maxHeartRateInBeatsPerMinute: number;
    maxPaceInMinutesPerKilometer: number;
    maxRunCadenceInStepsPerMinute: number;
    maxPushCadenceInStrokesPerMinute: number;
    maxSpeedInMetersPerSecond: number;
    numberOfActiveLengths: number;
    startingLatitudeInDegree: number;
    startingLongitudeInDegree: number;
    steps: number;
    strokes: number;
    totalElevationGainInMeters: number;
    totalElevationLossInMeters: number;
    manual: true;
  };
  samples: {
    startTimeInSeconds: number;
    latitudeInDegree: number;
    longitudeInDegree: number;
    elevationInMeters: number;
    airTemperatureCelcius: number;
    heartRate: number;
    speedMetersPerSecond: number;
    stepsPerMinute: number;
    totalDistanceInMeters: number;
    powerInWatts: number;
    bikeCadenceInRPM: number;
    swimCadenceInStrokesPerMinute: number;
    wheelChairCadenceInStrokesPerMinute: number;
    timerDurationInSeconds: number;
    clockDurationInSeconds: number;
    movingDurationInSeconds: number;
  }[];
  laps: {
    startTimeInSeconds: number;
  }[];
}

type GarminActivityDetailResponse = GarminActivityDetail[];

export const getActivityDetails = async (
  token: string,
  tokenSecret: string,
  from: number,
  to: number,
): Promise<Sample[]> => {
  try {
    const response = await axios.get(
      `${Config.ROOT_API_URL}garmin/activityDetails`,
      {
        params: {
          uploadStartTimeInSeconds: from,
          uploadEndTimeInSeconds: to,
          accessToken: token,
          accessTokenSecret: tokenSecret,
        },
      },
    );

    console.log(response.data);
    return [];
  } catch (e) {
    logError(e);
    Snackbar.show({text: 'Error fetching polar heart rate samples'});
    return [];
  }
};
