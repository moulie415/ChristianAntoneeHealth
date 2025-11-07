import {
  BiologicalSex,
  getBiologicalSex,
  getMostRecentQuantitySample,
  getDateOfBirth as healthKitGetDateOfBirth,
  isHealthDataAvailable,
  queryQuantitySamples,
  queryWorkoutSamples,
  requestAuthorization,
  saveQuantitySample,
  saveWorkoutSample,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import moment from 'moment';
import { NativeModules, Platform } from 'react-native';
import {
  getSdkStatus,
  initialize,
  insertRecords,
  readRecords,
  RecordingMethod,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { getIsPaired } from 'react-native-watch-connectivity';
import { Gender, Sample, WatchWorkoutResponse } from '../types/Shared';
import { getSamples, saveSample } from './api';
import { logError } from './error';

// @TODO need to fix this https://youtu.be/Z6xRCyhrg1A?si=S_dN9MLAnLEjBJSO
const { WatchWorkoutModule } = NativeModules;

export const isAvailable = async () => {
  if (Platform.OS === 'ios') {
    return isHealthDataAvailable();
  }
  const status = await getSdkStatus();
  return status === SdkAvailabilityStatus.SDK_AVAILABLE;
};

const round = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const initBiometrics = async () => {
  if (Platform.OS === 'ios') {
    return requestAuthorization(
      [
        'HKQuantityTypeIdentifierBodyMass',
        'HKWorkoutTypeIdentifier',
        'HKQuantityTypeIdentifierHeight',
        'HKQuantityTypeIdentifierBodyFatPercentage',
      ],
      [
        'HKCharacteristicTypeIdentifierDateOfBirth',
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierHeight',
        'HKQuantityTypeIdentifierHeartRate',
        'HKQuantityTypeIdentifierStepCount',
        'HKCharacteristicTypeIdentifierBiologicalSex',
        'HKWorkoutTypeIdentifier',
        'HKQuantityTypeIdentifierBodyFatPercentage',
        'HKQuantityTypeIdentifierActiveEnergyBurned',
      ],
    );
  }
  const initialized = await initialize();
  if (initialized) {
    await requestPermission([
      {
        accessType: 'read',
        recordType: 'ActiveCaloriesBurned',
      },
      {
        accessType: 'read',
        recordType: 'Steps',
      },
      {
        accessType: 'read',
        recordType: 'HeartRate',
      },
      {
        accessType: 'read',
        recordType: 'ActiveCaloriesBurned',
      },
      {
        accessType: 'read',
        recordType: 'ExerciseSession',
      },
      {
        accessType: 'write',
        recordType: 'ExerciseSession',
      },
      {
        accessType: 'read',
        recordType: 'Height',
      },
      {
        accessType: 'write',
        recordType: 'Height',
      },
      {
        accessType: 'read',
        recordType: 'Weight',
      },
      {
        accessType: 'write',
        recordType: 'Weight',
      },
      {
        accessType: 'read',
        recordType: 'BodyFat',
      },
      {
        accessType: 'write',
        recordType: 'BodyFat',
      },
      {
        accessType: 'read',
        recordType: 'BoneMass',
      },
      {
        accessType: 'write',
        recordType: 'BoneMass',
      },
    ]);
  }
};

export const getHeight = async (): Promise<number | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      const result = await getMostRecentQuantitySample(
        'HKQuantityTypeIdentifierHeight',
        'cm',
      );
      return result?.quantity || 0;
    }

    const { records } = await readRecords('Height', {
      timeRangeFilter: {
        operator: 'between',
        startTime: moment().subtract(30, 'days').startOf('day').toISOString(),
        endTime: moment().endOf('day').toISOString(),
      },
    });

    const latest = records[records.length - 1];
    // value is in metres so need to convert to cm
    return round(latest.height.inMeters * 100);
  } catch (e) {
    logError(e);
  }
};

export const getWeight = async (): Promise<number | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      const result = await getMostRecentQuantitySample(
        'HKQuantityTypeIdentifierBodyMass',
        'kg',
      );
      return result?.quantity || 0;
    }

    const { records } = await readRecords('Weight', {
      timeRangeFilter: {
        operator: 'between',
        startTime: moment().subtract(30, 'days').startOf('day').toISOString(),
        endTime: moment().endOf('day').toISOString(),
      },
    });

    const latest = records[records.length - 1];
    return round(latest.weight.inKilograms);
  } catch (e) {
    logError(e);
  }
};

export const getWeightSamples = async (uid: string) => {
  const samples = await getSamples('weight', uid);

  return samples;
};

export const getHeightSamples = async (uid: string) => {
  const samples = await getSamples('height', uid);

  return samples;
};

export const getStepSamples = async (
  startDate = moment().utc().startOf('day').toDate(),
  endDate = moment().utc().endOf('day').toDate(),
): Promise<Sample[] | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      const results = await queryQuantitySamples(
        'HKQuantityTypeIdentifierStepCount',
        { filter: { startDate, endDate } },
      );
      return results.map(result => {
        return {
          value: result.quantity,
          startDate: result.startDate.toISOString(),
          endDate: result.endDate.toISOString(),
        };
      });
    }

    const { records } = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    return records
      .filter(
        record =>
          record.metadata?.clientRecordVersion !==
          RecordingMethod.RECORDING_METHOD_MANUAL_ENTRY,
      )
      .map(record => {
        return {
          value: record.count,
          endDate: record.endTime,
          startDate: record.startTime,
        };
      });
  } catch (e) {
    logError(e);
    return [];
  }
};

export const getWeeklySteps = async (): Promise<Sample[] | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }

    const startDate = moment().utc().startOf('isoWeek').toDate();
    const endDate = moment().utc().endOf('day').toDate();
    if (Platform.OS === 'ios') {
      const results = await queryQuantitySamples(
        'HKQuantityTypeIdentifierStepCount',
        { filter: { startDate, endDate } },
      );
      return results.map(result => {
        return {
          value: result.quantity,
          startDate: result.startDate.toISOString(),
          endDate: result.endDate.toISOString(),
        };
      });
    }

    const { records } = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    return records.map(record => {
      return {
        value: record.count,
        endDate: record.endTime,
        startDate: record.startTime,
      };
    });
  } catch (e) {
    logError(e);
    return [];
  }
};

export const getActivitySamples = async (startDate: Date, endDate: Date) => {
  try {
    if (!(await isAvailable())) {
      return;
    }

    if (Platform.OS === 'ios') {
      const results = await queryWorkoutSamples({
        filter: { startDate, endDate },
      });
      return results;
    }

    const { records } = await readRecords('ExerciseSession', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    return records;
  } catch (e) {
    logError(e);
    return [];
  }
};

export const getSex = async (): Promise<Gender | undefined> => {
  if (Platform.OS === 'ios') {
    if (!(await isAvailable())) {
      return;
    }
    const result = getBiologicalSex();
    switch (result) {
      case BiologicalSex.female:
        return 'female';
      case BiologicalSex.male:
        return 'male';
      default:
        return 'none';
    }
  }
};

export const getDateOfBirth = async (): Promise<string | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      const result = healthKitGetDateOfBirth();
      return result?.toISOString();
    }
  } catch (e) {
    logError(e);
  }
};

export const saveWeight = async (uid: string, value?: number) => {
  try {
    if (!value) {
      return;
    }
    await saveSample('weight', value, uid);
    if (!(await isAvailable())) {
      return;
    }

    if (Platform.OS === 'ios') {
      await saveQuantitySample(
        'HKQuantityTypeIdentifierBodyMass',
        'kg',
        value,
        new Date(),
        new Date(),
        {},
      );
    }

    await insertRecords([
      {
        recordType: 'Weight',
        weight: { value, unit: 'kilograms' },
        time: new Date().toISOString(),
      },
    ]);
  } catch (e) {
    logError(e);
  }
};

export const saveHeight = async (uid: string, value?: number) => {
  try {
    if (!value) {
      return;
    }
    await saveSample('height', value, uid);
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      await saveQuantitySample(
        'HKQuantityTypeIdentifierHeight',
        'cm',
        value,
        new Date(),
        new Date(),
        {},
      );
    }

    await insertRecords([
      {
        recordType: 'Height',
        height: { value: value / 100, unit: 'meters' },
        time: new Date().toISOString(),
      },
    ]);
  } catch (e) {
    logError(e);
  }
};

export const getHeartRateSamples = async (
  startDate: Date,
  endDate: Date,
): Promise<Sample[]> => {
  try {
    if (!(await isAvailable())) {
      return [];
    }
    if (Platform.OS === 'ios') {
      const results = await queryQuantitySamples(
        'HKQuantityTypeIdentifierHeartRate',
        { filter: { startDate, endDate } },
      );

      return results.map(result => {
        return {
          value: result.quantity,
          startDate: result.startDate.toISOString(),
          endDate: result.endDate.toISOString(),
        };
      });
    }

    const { records } = await readRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    return records.reduce((acc: Sample[], cur) => {
      return [
        ...acc,
        ...cur.samples.map(sample => {
          return {
            value: sample.beatsPerMinute,
            startDate: sample.time,
            endDate: sample.time,
          };
        }),
      ];
    }, []);
  } catch (e) {
    logError(e);
    return [];
  }
};

export const getCalorieSamples = async (
  startDate: Date,
  endDate: Date,
): Promise<Sample[]> => {
  try {
    if (!(await isAvailable())) {
      return [];
    }
    if (Platform.OS === 'ios') {
      const results = await queryQuantitySamples(
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        { filter: { startDate, endDate } },
      );
      return results.map(result => {
        return {
          value: result.quantity,
          startDate: result.startDate.toISOString(),
          endDate: result.endDate.toISOString(),
        };
      });
    }

    const { records } = await readRecords('ActiveCaloriesBurned', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    return records.map(record => {
      return {
        startDate: record.startTime,
        endDate: record.endTime,
        value: record.energy.inKilocalories,
      };
    });
  } catch (e) {
    logError(e);
    return [];
  }
};

export const saveWorkout = async (
  seconds: number,
  name: string,
  description: string,
  calories: number,
) => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    const startDate = moment().subtract(seconds, 'seconds').toDate();
    const endDate = moment().toDate();
    if (Platform.OS === 'ios') {
      await saveWorkoutSample(
        WorkoutActivityType.functionalStrengthTraining,
        [],
        startDate,
        endDate,
        { energyBurned: calories },
        { name, description },
      );
    }
  } catch (e) {
    logError(e);
  }
};

export const getBodyFatPercentageSamples = async (uid: string) => {
  const samples = await getSamples('bodyFatPercentage', uid);
  return samples;
};

export const saveBodyFatPercentage = async (value: number, uid: string) => {
  try {
    await saveSample('bodyFatPercentage', value, uid);
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      await saveQuantitySample(
        'HKQuantityTypeIdentifierBodyFatPercentage',
        '%',
        value,
        new Date(),
        new Date(),
        {},
      );
    }
  } catch (e) {
    logError(e);
  }
};

export const startWatchWorkout = async () => {
  try {
    if (Platform.OS === 'ios') {
      const paired = await getIsPaired();
      debugger;
      if (paired) {
        await WatchWorkoutModule.startWatchWorkout();
      }
    }
  } catch (e) {
    logError(e);
  }
};

export const endWatchWorkout = async () => {
  try {
    if (Platform.OS === 'ios') {
      const paired = await getIsPaired();
      if (paired) {
        const response: WatchWorkoutResponse =
          await WatchWorkoutModule.endWatchWorkout();
        return response;
      }
    }
  } catch (e) {
    logError(e);
  }
};
