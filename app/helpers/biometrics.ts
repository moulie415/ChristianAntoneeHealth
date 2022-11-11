import {Alert, Linking, Platform} from 'react-native';
import AppleHealthKit from 'react-native-health';
import GoogleFit, {ActivityType, BucketUnit} from 'react-native-google-fit';
import moment from 'moment';
import {googleFitOptions, healthKitOptions} from '../constants/strings';
import {Gender, Unit} from '../types/Profile';
import {StepSample} from '../types/Shared';
import {logError} from './error';
import ListItem from '../components/commons/ListItem';

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
  const result = await GoogleFit.authorize(googleFitOptions);
  if (!result.success) {
    throw Error('Error authorizing google fit');
  }
};

export const getHeight = async (): Promise<number | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
    startDate: moment().subtract(1, 'month').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  const latest = response[response.length - 1];
  if (latest && latest.value && typeof latest.value === 'number') {
    // value is in metres so need to convert to cm
    return round(latest.value * 100);
  }
};

export const getWeight = async (): Promise<number | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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
    startDate: moment().subtract(1, 'month').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  const latest = response[response.length - 1];
  if (latest && latest.value && typeof latest.value === 'number') {
    // value is in kg so no need to convert
    return round(latest.value);
  }
};

export const getWeightSamples = async (unit: Unit, months = 1) => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getWeightSamples(
        {
          startDate: moment()
            .subtract(months, 'month')
            .startOf('day')
            .toISOString(),
          endDate: moment().endOf('day').toISOString(),
          // @ts-ignore
          unit: unit === 'lbs' ? 'pound' : 'gram',
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              unit === 'imperial'
                ? results
                : results.map(result => {
                    return {...result, value: result.value / 1000};
                  }),
            );
          }
        },
      );
    });
  }
  const response = await GoogleFit.getWeightSamples({
    startDate: moment().subtract(months, 'month').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
    unit: unit === 'imperial' ? 'pound' : 'kg',
  });
  return response;
};

export const getHeightSamples = async (unit: Unit, months = 1) => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeightSamples(
        {
          startDate: moment()
            .subtract(months, 'month')
            .startOf('day')
            .toISOString(),
          endDate: moment().endOf('day').toISOString(),
          // @ts-ignore
          unit: unit === 'imperial' ? 'inch' : 'meter',
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              unit === 'imperial'
                ? results
                : results.map(result => {
                    return {...result, value: result.value * 100};
                  }),
            );
          }
        },
      );
    });
  }
  const response = await GoogleFit.getHeightSamples({
    startDate: moment().subtract(months, 'month').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  return response.map(item => {
    return {...item, value: item.value * 100};
  });
};

export const getStepSamples = async (months = 1) => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: moment()
            .subtract(months, 'month')
            .startOf('day')
            .toISOString(),
          endDate: moment().endOf('day').toISOString(),
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
    startDate: moment().subtract(months, 'month').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
    bucketUnit: BucketUnit.DAY,
    bucketInterval: 1,
  });

  // difference between steps and rawSteps?
  return [].concat.apply(
    [],
    response.map(sample => sample.steps),
  );
};

export const getWeeklySteps = async (): Promise<StepSample[]> => {
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
  const steps = await GoogleFit.getWeeklySteps();
  return [].concat.apply(
    [],
    steps.map(sample => sample.steps),
  );
};

export const getActivitySamples = async (months = 1) => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getSamples(
        {
          startDate: moment()
            .subtract(months, 'month')
            .startOf('day')
            .toISOString(),
          endDate: moment().endOf('day').toISOString(),
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
    startDate: moment().subtract(months, 'month').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });

  return response;
};

export const getSex = (): Promise<Gender | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
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

export const getDateOfBirth = (): Promise<string | undefined> => {
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

export const saveWeight = async (value: number, unit: Unit) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.saveWeight(
        {value: unit === 'metric' ? value * 2.20462 : value},
        (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        },
      );
    } else {
      GoogleFit.saveWeight(
        {
          value: unit === 'metric' ? value * 2.20462 : value,
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

export const saveHeight = async (value: number, unit: Unit) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.saveHeight(
        {value: unit === 'metric' ? value * 0.393701 : value},
        (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        },
      );
    } else {
      GoogleFit.saveHeight(
        {
          value: unit === 'metric' ? value / 100 : value * 0.0254,
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

export const saveWorkout = (
  startDate: string,
  endDate: string,
  calories: number,
  name: string,
  description: string,
) => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.saveWorkout(
        {
          type: AppleHealthKit.Constants.Activities.FunctionalStrengthTraining,
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
          console.log(res);
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
};

const getFatPercentage = (months = 1) => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getBodyFatPercentageSamples(
        {
          startDate: moment()
            .subtract(months, 'month')
            .startOf('day')
            .toISOString(),
          endDate: moment().endOf('day').toISOString(),
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
  } else {
    
  }
};

const saveFatPercentage = (value: number) => {
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
  } else {
  }
};

const getMuscleMass = () => {};

const saveMuscleMass = () => {};

const getBoneDensity = () => {};

const saveBoneDensity = () => {};
