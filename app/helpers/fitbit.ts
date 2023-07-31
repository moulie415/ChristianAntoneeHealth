import axios from 'axios';
import {logError} from './error';
import {Sample} from '../types/Shared';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import Config from 'react-native-config';

export interface FitbitHeartRateResponse {
  'activities-heart': ActivitiesHeart[];
}

export interface ActivitiesHeart {
  dateTime: string;
  value: Value;
}

export interface Value {
  customHeartRateZones: CustomHeartRateZone[];
  heartRateZones: HeartRateZone[];
  restingHeartRate: number;
}

export interface CustomHeartRateZone {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}

export interface HeartRateZone {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}

export const refreshToken = async (
  uid: string,
  rToken: string,
): Promise<void | {
  fitbitToken: string;
  fitbitRefreshToken: string;
  fitbitUserId: string;
  fitbitTokenExpiresIn: number;
  fitbitTokenTimestamp: number;
}> => {
  try {
    const response = await axios.get(
      `${Config.ROOT_API_URL}auth/fitbit/refresh`,
      {params: {uid, fitbitRefreshToken: rToken}},
    );
    const {
      fitbitToken,
      fitbitRefreshToken,
      fitbitUserId,
      fitbitTokenExpiresIn,
      fitbitTokenTimestamp,
    } = response.data;
    return {
      fitbitToken,
      fitbitRefreshToken,
      fitbitUserId,
      fitbitTokenExpiresIn,
      fitbitTokenTimestamp,
    };
  } catch (e) {
    Snackbar.show({text: 'Error authenticating with Fitbit'});
    logError(e);
  }
};

export const getHeartRateTimeSeriesByDate = async (
  token: string,
  fitbitUserId: string,
  from: Date,
  to: Date,
): Promise<{samples: Sample[]; data: ActivitiesHeart[]}> => {
  try {
    const {data}: {data: FitbitHeartRateResponse} = await axios.get(
      `https://api.fitbit.com/1/user/${fitbitUserId}/activities/heart/date/today/1d.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const activities: ActivitiesHeart[] = [];
    const samples: Sample[] = [];
    data['activities-heart'].forEach(activity => {
      if (
        moment(activity.dateTime).isAfter(from) &&
        moment(activity.dateTime).isBefore(to)
      ) {
        activity.value.heartRateZones.forEach(zone => {
          activities.push(activity);
          samples.push({
            value: zone.max,
            startDate: moment(activity.dateTime).toISOString(),
            endDate: moment(activity.dateTime).toISOString(),
          });
        });
      }
    });
    return {samples, data: activities};
  } catch (e) {
    Snackbar.show({text: 'Error fetching Fitbit heart rate samples'});
    logError(e);
    return {samples: [], data: []};
  }
};
