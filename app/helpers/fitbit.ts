import axios from 'axios';
import {logError} from './error';

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
  } catch (e) {
    logError(e);
  }
};
