import * as _ from 'lodash';
import {useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {getHeartRateSamples} from '../helpers/biometrics';
import {Sample} from '../types/Shared';

const useHealthListener = (startDate: Date) => {
  const [heartRateSamples, setHeartRateSamples] = useState<Sample[]>([]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:HeartRate:new',
        async () => {
          const samples = await getHeartRateSamples(startDate, new Date());
          if (!_.isEqual(heartRateSamples, samples)) {
            setHeartRateSamples(
              samples.map(({startDate: s, endDate: e, value}) => {
                return {startDate: s, endDate: e, value};
              }),
            );
          }
        },
      );
    }
  }, [startDate]);

  return {heartRateSamples};
};

export default useHealthListener;
