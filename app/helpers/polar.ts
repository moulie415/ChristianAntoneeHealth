import moment from 'moment';
import {logError} from './error';
import {Sample} from '../types/Shared';
import Snackbar from 'react-native-snackbar';

const makeRequest = async (url: string, token: string) => {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {headers});
  return response.json();
};

interface PolarHeartRateResponse {
  polar_user: string;
  date: string;
  heart_rate_samples: {heart_rate: number; sample_time: string}[];
}

export const getHeartRateSamplesWithRange = async (
  token: string,
  from: Date,
  to: Date,
): Promise<Sample[]> => {
  try {
    const json: PolarHeartRateResponse = await makeRequest(
      `https://www.polaraccesslink.com/v3/users/continuous-heart-rate?from=${moment(
        from,
      ).format('YYYY-MM-DD')}&to=${moment(to).format('YYYY-MM-DD')}`,
      token,
    );
    console.log(json);
    return json.heart_rate_samples.map(sample => {
      return {
        value: sample.heart_rate,
        startDate: `${json.date}T${sample.sample_time}Z`,
        endDate: `${json.date}T${sample.sample_time}Z`,
      };
    });
  } catch (e) {
    logError(e);
    Snackbar.show({text: 'Error fetching polar heart rate samples'});
    return [];
  }
};
