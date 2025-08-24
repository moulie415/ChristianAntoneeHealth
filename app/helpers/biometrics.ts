import moment from 'moment';
import {NativeModules, Platform} from 'react-native';
// import {getApiLevel} from 'react-native-device-info';
import AppleHealthKit from 'react-native-health';
import {
  RecordingMethod,
  SdkAvailabilityStatus,
  getSdkStatus,
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
} from 'react-native-health-connect';
import {getIsPaired} from 'react-native-watch-connectivity';
import {healthConnectPermissions, healthKitOptions} from '../constants/strings';
import {Gender, Sample, WatchWorkoutResponse} from '../types/Shared';
import {getSamples, saveSample} from './api';
import {logError} from './error';

const {WatchWorkoutModule} = NativeModules;

export const isAvailable = async () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.isAvailable((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  const status = await getSdkStatus();
  return status === SdkAvailabilityStatus.SDK_AVAILABLE;
};

const round = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const initBiometrics = async () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(healthKitOptions, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  }
  const initialized = await initialize();
  if (initialized) {
    await requestPermission(healthConnectPermissions);
  }
};

export const getHeight = async (): Promise<number | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      const promise = new Promise<number | undefined>((resolve, reject) => {
        // @ts-ignore
        AppleHealthKit.getLatestHeight(null, (e, result) => {
          if (e) {
            reject(e);
          } else {
            if (result.value && typeof result.value === 'number') {
              // values is in inches so need to convert to cm
              resolve(round(result.value * 2.54));
            } else {
              resolve(undefined);
            }
          }
        });
      });

      const height = await promise;
      return height;
    }

    const {records} = await readRecords('Height', {
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
      const promise = new Promise<number | undefined>((resolve, reject) => {
        // @ts-ignore
        AppleHealthKit.getLatestWeight(null, (e, result) => {
          if (e) {
            reject(e);
          } else {
            if (result.value && typeof result.value === 'number') {
              // value is in pounds so need to convert to kg
              resolve(round(result.value * 0.453592));
            } else {
              resolve(undefined);
            }
          }
        });
      });

      const weight = await promise;
      return weight;
    }

    const {records} = await readRecords('Weight', {
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
      const promise = new Promise<Sample[] | undefined>((resolve, reject) => {
        AppleHealthKit.getDailyStepCountSamples(
          {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          },
        );
      });

      const samples = await promise;
      return samples;
    }

    const {records} = await readRecords('Steps', {
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

    const startDate = moment().utc().startOf('isoWeek').toISOString();
    const endDate = moment().utc().endOf('day').toISOString();
    if (Platform.OS === 'ios') {
      const promise = new Promise<Sample[] | undefined>((resolve, reject) => {
        AppleHealthKit.getDailyStepCountSamples(
          {
            startDate,
            endDate,
          },
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(
                results.map(result => {
                  return {
                    startDate: result.startDate,
                    endDate: result.endDate,
                    value: result.value,
                  };
                }),
              );
            }
          },
        );
      });

      const samples = await promise;
      return samples;
    }

    const {records} = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate,
        endTime: endDate,
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
      const promise = new Promise<Sample[] | undefined>((resolve, reject) => {
        AppleHealthKit.getSamples(
          {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          },
        );
      });
      const samples = await promise;
      return samples;
    }

    const {records} = await readRecords('ExerciseSession', {
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
    const promise = new Promise<Gender | undefined>((resolve, reject) => {
      // @ts-ignore
      AppleHealthKit.getBiologicalSex(null, (e, result) => {
        if (e) {
          reject(e);
        }
        // @ts-ignore
        if (result.value === 'male' || result.value === 'female') {
          resolve(result.value);
        } else {
          resolve(undefined);
        }
      });
    });
    const sex = await promise;
    return sex;
  }
};

export const getDateOfBirth = async (): Promise<string | undefined> => {
  try {
    if (!(await isAvailable())) {
      return;
    }
    if (Platform.OS === 'ios') {
      const promise = new Promise<string | undefined>((resolve, reject) => {
        AppleHealthKit.getDateOfBirth(null, (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result.value);
          }
        });
      });
      const dob = await promise;
      return dob;
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
      return new Promise((resolve, reject) => {
        AppleHealthKit.saveWeight({value: value * 2.20462}, (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        });
      });
    }

    await insertRecords([
      {
        recordType: 'Weight',
        weight: {value, unit: 'kilograms'},
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
      return new Promise((resolve, reject) => {
        AppleHealthKit.saveHeight({value: value * 0.393701}, (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        });
      });
    }

    await insertRecords([
      {
        recordType: 'Height',
        height: {value: value / 100, unit: 'meters'},
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
      const promise = new Promise<Sample[]>((resolve, reject) => {
        AppleHealthKit.getHeartRateSamples(
          {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          },
        );
      });
      const samples = await promise;
      return samples;
    }

    const {records} = await readRecords('HeartRate', {
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
      const promise = new Promise<Sample[]>((resolve, reject) => {
        AppleHealthKit.getActiveEnergyBurned(
          {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(
                results.map(res => ({
                  startDate: res.startDate,
                  endDate: res.endDate,
                  value: res.value,
                })),
              );
            }
          },
        );
      });
      const samples = await promise;
      return samples;
    }

    const {records} = await readRecords('ActiveCaloriesBurned', {
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
    const startDate = moment().subtract(seconds, 'seconds').toISOString();
    const endDate = moment().toISOString();
    if (Platform.OS === 'ios') {
      await new Promise((resolve, reject) => {
        AppleHealthKit.saveWorkout(
          {
            type: AppleHealthKit.Constants.Activities
              .FunctionalStrengthTraining,
            startDate,
            endDate,
            // @ts-ignore
            energyBurned: calories,
            energyBurnedUnit: 'calorie',
          },
          (e: Error, res) => {
            if (e) {
              logError(e);
              reject(e);
              return;
            }
            resolve(res);
            // workout successfully saved
          },
        );
      });
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
      await new Promise((resolve, reject) => {
        AppleHealthKit.saveBodyFatPercentage({value}, (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        });
      });
    }
  } catch (e) {
    logError(e);
  }
};

export const startWatchWorkout = async () => {
  try {
    if (Platform.OS === 'ios') {
      const paired = await getIsPaired();
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
