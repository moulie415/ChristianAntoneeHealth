import axios from 'axios';
import {logError} from './error';
import {Sample} from '../types/Shared';
import moment from 'moment';

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

export const getHeartRateTimeSeriesByDate = async (
  token: string,
  from: Date,
  to: Date,
) => {
  try {
    const {data}: {data: FitbitHeartRateResponse} = await axios.get(
      'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const samples: Sample[] = [];
    data['activities-heart'].forEach(activity => {
      if (
        moment(activity.dateTime).isAfter(from) &&
        moment(activity.dateTime).isBefore(to)
      ) {
        activity.value.heartRateZones.forEach(zone => {
          samples.push({
            value: zone.max,
            startDate: moment(activity.dateTime).toISOString(),
            endDate: moment(activity.dateTime).toISOString(),
          });
        });
      }
    });
    return samples;
  } catch (e) {
    logError(e);
  }
};
