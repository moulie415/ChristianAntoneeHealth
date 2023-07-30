import moment from 'moment';
import {logError} from './error';
import {Sample} from '../types/Shared';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

const makeRequest = async (url: string, token: string, params: any = {}) => {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log(url, headers);
  const response = await axios.get(url, {headers, params});
  return response.data;
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
    console.log(token)
    const {data} = await axios.get(
      'https://www.polaraccesslink.com/v3/users/continuous-heart-rate',
      {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`},
        params: {
          from: moment(from).format('YYYY-MM-DD'),
          to: moment(to).format('YYYY-MM-DD'),
        },
      },
    );
    // const data: PolarHeartRateResponse = await makeRequest(
    //   'https://www.polaraccesslink.com/v3/users/continuous-heart-rate',
    //   token,
    //   {
    //     from: moment(from).format('YYYY-MM-DD'),
    //     to: moment(to).format('YYYY-MM-DD'),
    //   },
    // );
    console.log(data);
    return data.heart_rate_samples.map(sample => {
      return {
        value: sample.heart_rate,
        startDate: `${data.date}T${sample.sample_time}Z`,
        endDate: `${data.date}T${sample.sample_time}Z`,
      };
    });
  } catch (e) {
    console.log(e);
    logError(e);
    Snackbar.show({text: 'Error fetching polar heart rate samples'});
    return [];
  }
};
