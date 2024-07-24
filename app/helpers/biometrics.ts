import moment from 'moment';
import {
  Alert,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {getApiLevel} from 'react-native-device-info';
import GoogleFit, {ActivityType, BucketUnit} from 'react-native-google-fit';
import AppleHealthKit from 'react-native-health';
import {getIsPaired} from 'react-native-watch-connectivity';
import {googleFitOptions, healthKitOptions} from '../constants/strings';
import {Gender, Sample, StepSample} from '../types/Shared';
import {getSamples, saveSample} from './api';
import {logError} from './error';

const {WatchWorkoutModule} = NativeModules;

export const isAvailable = () => {
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
  return new Promise(resolve => {
    GoogleFit.isAvailable((isError, result) => {
      resolve(result);
    });
  });
};

export const isEnabled = () => {
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
  return new Promise((resolve, reject) => {
    GoogleFit.isEnabled((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const linkToGoogleFit = () => {
  return Linking.openURL('market://details?id=com.google.android.apps.fitness');
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
  const apiLevel = await getApiLevel();
  if (apiLevel >= 10) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    );
  }
  const result = await GoogleFit.authorize(googleFitOptions);
  if (!result.success) {
    throw Error('Error authorizing google fit');
  }
};

export const getHeight = async (): Promise<number | undefined> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
  const response = await GoogleFit.getHeightSamples({
    startDate: moment().subtract(30, 'days').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  const latest = response[response.length - 1];
  if (latest && latest.value && typeof latest.value === 'number') {
    // value is in metres so need to convert to cm
    return round(latest.value * 100);
  }
};

export const getWeight = async (): Promise<number | undefined> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
  const response = await GoogleFit.getWeightSamples({
    startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  const latest = response[response.length - 1];
  if (latest && latest.value && typeof latest.value === 'number') {
    // value is in kg so no need to convert
    return round(latest.value);
  }
};

export const getWeightSamples = async (uid: string) => {
  const samples = await getSamples('weight', uid);
  // let platformSamples: Sample[] = [];
  // if (Platform.OS === 'ios') {
  //   platformSamples = await new Promise<Sample[]>(async (resolve, reject) => {
  //     if (!(await isAvailable()) || !(await isEnabled())) {
  //       return [];
  //     }
  //     AppleHealthKit.getWeightSamples(
  //       {
  //         startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
  //         endDate: moment().endOf('day').toISOString(),
  //         // @ts-ignore
  //         unit: 'gram',
  //       },
  //       (err, results) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(
  //             results.map(result => {
  //               return {...result, value: result.value / 1000};
  //             }),
  //           );
  //         }
  //       },
  //     );
  //   });
  // }
  // if (
  //   Platform.OS === 'android' &&
  //   (await isAvailable()) &&
  //   (await isEnabled())
  // ) {
  //   platformSamples = await GoogleFit.getWeightSamples({
  //     startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
  //     endDate: moment().endOf('day').toISOString(),
  //     unit: 'kg',
  //   });
  // }

  return samples;

  // return _.uniqBy(
  //   [...platformSamples, ...samples],
  //   sample => sample.startDate + sample.endDate,
  // );
};

export const getHeightSamples = async (uid: string) => {
  const samples = await getSamples('height', uid);
  // let platformSamples: Sample[] = [];

  // if (Platform.OS === 'ios') {
  //   platformSamples = await new Promise<Sample[]>(async (resolve, reject) => {
  //     if (!(await isAvailable()) || !(await isEnabled())) {
  //       return [];
  //     }
  //     AppleHealthKit.getHeightSamples(
  //       {
  //         startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
  //         endDate: moment().endOf('day').toISOString(),
  //         // @ts-ignore
  //         unit: 'meter',
  //       },
  //       (err, results) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(
  //             results.map(result => {
  //               return {...result, value: result.value * 100};
  //             }),
  //           );
  //         }
  //       },
  //     );
  //   });
  // }
  // if (
  //   Platform.OS === 'android' &&
  //   (await isAvailable()) &&
  //   (await isEnabled())
  // ) {
  //   platformSamples = await GoogleFit.getHeightSamples({
  //     startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
  //     endDate: moment().endOf('day').toISOString(),
  //   });
  // }

  return samples;
  // return _.uniqBy(
  //   [...platformSamples, ...samples],
  //   sample => sample.startDate + sample.endDate,
  // );
};

export const getStepSamples = async (
  startDate = moment().startOf('day').toDate(),
  endDate = moment().endOf('day').toDate(),
): Promise<Sample[] | undefined> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
  const response = await GoogleFit.getDailyStepCountSamples({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    bucketUnit: BucketUnit.DAY,
    bucketInterval: 1,
  });

  // difference between steps and rawSteps?
  return response.reduce((acc: Sample[], cur) => {
    if (cur.source === 'com.google.android.gms:estimated_steps') {
      return [
        ...acc,
        ...cur.steps.map(item => ({
          endDate: item.date,
          startDate: item.date,
          value: item.value,
        })),
      ];
    }
    return acc;
  }, []);
};

export const getWeeklySteps = async (): Promise<StepSample[]> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return [];
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: moment().subtract(1, 'week').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              results.map(result => {
                return {date: result.startDate, value: result.value};
              }),
            );
          }
        },
      );
    });
  }
  const response = await GoogleFit.getWeeklySteps();
  return response.reduce((acc: {date: string; value: number}[], cur) => {
    return [...acc, ...cur.steps];
  }, []);
};

export const getActivitySamples = async (startDate: Date, endDate: Date) => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
  const response = await GoogleFit.getActivitySamples({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  return response;
};

export const getSex = (): void | Promise<Gender | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
};

export const getDateOfBirth = (): void | Promise<string | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDateOfBirth(null, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result.value);
        }
      });
    });
  }
};

export const saveWeight = async (uid: string, value?: number) => {
  if (!value) {
    return;
  }
  await saveSample('weight', value, uid);
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.saveWeight({value: value * 2.20462}, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    } else {
      GoogleFit.saveWeight(
        {
          value: value * 2.20462,
          date: new Date().toISOString(),
          unit: 'pound',
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    }
  });
};

export const saveHeight = async (uid: string, value?: number) => {
  if (!value) {
    return;
  }
  await saveSample('height', value, uid);
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.saveHeight({value: value * 0.393701}, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    } else {
      GoogleFit.saveHeight(
        {
          value: value / 100,
          date: new Date().toISOString(),
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    }
  });
};

export const getHeartRateSamples = async (
  startDate: Date,
  endDate: Date,
): Promise<Sample[]> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
  return GoogleFit.getHeartRateSamples({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    bucketUnit: BucketUnit.SECOND,
  });
};

export const getCalorieSamples = async (
  startDate: Date,
  endDate: Date,
): Promise<Sample[]> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
  }
  const samples = await GoogleFit.getDailyCalorieSamples({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    bucketUnit: BucketUnit.DAY,
  });

  return samples.map(sample => ({
    startDate: sample.startDate,
    endDate: sample.endDate,
    value: sample.calorie,
  }));
};

export const saveWorkout = async (
  seconds: number,
  name: string,
  description: string,
  calories: number,
) => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  try {
    const startDate = moment().subtract(seconds, 'seconds').toISOString();
    const endDate = moment().toISOString();
    if (Platform.OS === 'ios') {
      return new Promise((resolve, reject) => {
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
    } else {
      return GoogleFit.saveWorkout({
        startDate: moment(startDate).toISOString(),
        endDate: moment(endDate).toISOString(),
        activityType: ActivityType.Strength_training,
        sessionName: name,
        identifier: `workout:${moment(startDate).toISOString()} - ${moment(
          endDate,
        ).toISOString()}`,
        calories,
        description,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert(
        `Error saving workout to ${
          Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
        }`,
        e.message,
      );
    }
  }
};

export const getBodyFatPercentageSamples = async (uid: string) => {
  const samples = await getSamples('bodyFatPercentage', uid);
  // if (Platform.OS === 'ios') {
  //   const iosSamples = await new Promise<Sample[]>(async (resolve, reject) => {
  //     if (!(await isAvailable()) || !(await isEnabled())) {
  //       return [];
  //     }
  //     AppleHealthKit.getBodyFatPercentageSamples(
  //       {
  //         startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
  //         endDate: moment().endOf('day').toISOString(),
  //       },
  //       (err, results) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(
  //             results.map(res => {
  //               return {...res, value: res.value * 100};
  //             }),
  //           );
  //         }
  //       },
  //     );
  //   });
  //   return _.uniqBy(
  //     [...iosSamples, ...samples],
  //     sample => sample.startDate + sample.endDate,
  //   );
  // } else {
  return samples;
  // }
};

export const saveBodyFatPercentage = async (value: number, uid: string) => {
  await saveSample('bodyFatPercentage', value, uid);
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.saveBodyFatPercentage({value}, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
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

interface WatchWorkoutResponse {
  energySamples: Sample[];
  heartRateSamples: Sample[];
}

export const endWatchWorkout = async (startDate: Date) => {
  try {
    if (Platform.OS === 'ios') {
      const paired = await getIsPaired();
      if (paired) {
        const {energySamples, heartRateSamples}: WatchWorkoutResponse =
          await WatchWorkoutModule.endWatchWorkout();
        return {
          energySamples: energySamples.filter(
            s => new Date(s.startDate) > startDate,
          ),
          heartRateSamples: heartRateSamples.filter(
            s => new Date(s.startDate) > startDate,
          ),
        };
      }
    }
  } catch (e) {
    logError(e);
  }
};
