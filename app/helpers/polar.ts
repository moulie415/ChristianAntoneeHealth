import moment from 'moment';
import {logError} from './error';
import {Sample} from '../types/Shared';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

interface PolarHeartRateResponse {
  heart_rates: {
    polar_user: string;
    date: string;
    heart_rate_samples: {heart_rate: number; sample_time: string}[];
  }[];
}

export const registerUser = async (uid: string, token: string) => {
  try {
    await axios.post(
      'https://www.polaraccesslink.com/v3/users',
      {
        'member-id': uid,
      },
      {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`},
      },
    );
  } catch (e) {
    logError(e);
    Snackbar.show({text: 'Error registering for Polar'});
  }
};

export const getHeartRateSamples = async (
  token: string,
  from: Date,
  to: Date,
): Promise<Sample[]> => {
  try {
    const {data}: {data: PolarHeartRateResponse} = await axios.get(
      'https://www.polaraccesslink.com/v3/users/continuous-heart-rate',
      {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`},
        params: {
          date: moment(from).format('YYYY-MM-DD'),
        },
      },
    );
    return data.heart_rates.reduce((acc: Sample[], cur) => {
      const samples: Sample[] = [];
      cur.heart_rate_samples.forEach(sample => {
        const dateString = `${cur.date}T${sample.sample_time}Z`;
        const date = moment(dateString);
        if (date.isAfter(from) && date.isBefore(to)) {
          samples.push({
            value: sample.heart_rate,
            startDate: `${cur.date}T${sample.sample_time}Z`,
            endDate: `${cur.date}T${sample.sample_time}Z`,
          });
        }
      });
      return [...acc, ...samples];
    }, []);
  } catch (e) {
    logError(e);
    Snackbar.show({text: 'Error fetching polar heart rate samples'});
    return [];
  }
};
