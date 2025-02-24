import * as _ from 'lodash';
import moment from 'moment';
import {Share} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {capitalizeFirstLetter} from '.';
import Exercise, {Muscle} from '../types/Exercise';
import {Equipment, Gender, Level} from '../types/Shared';
import {logError} from './error';

const levelMapping = {
  null: 0,
  undefined: 0,
  [Level.BEGINNER]: 1,
  [Level.INTERMEDIATE]: 2,
  [Level.ADVANCED]: 3,
};

export const sortByLevel = (exercises: Exercise[]) => {
  return exercises.sort((a, b) =>
    a.name ? a.name.length : 0 - (b.name ? b.name.length : 0),
  );
};

export const frontMuscles: Muscle[] = [
  'abdominals',
  'all',
  'arms',
  'biceps',
  'chest',
  'hipFlexors',
  'iliotibialBand',
  'leg',
  'obliques',
  'shoulders',
  'quadriceps',
  'innerThigh',
  'upperBody',
];

export const backMuscles: Muscle[] = [
  'all',
  'calves',
  'gluteals',
  'calves',
  'hamstrings',
  'upperBack',
  'upperBody',
  'midBack',
  'lowBack',
  'arms',
  'triceps',
  'leg',
];

export const muscleReadableString = (muscle: Muscle) => {
  switch (muscle) {
    case 'upperBack':
      return 'upper back';
    case 'midBack':
      return 'mid back';
    case 'lowBack':
      return 'lower back';
    case 'leg':
      return 'legs';
    case 'hipFlexors':
      return 'hip flexors';
    case 'iliotibialBand':
      return 'iliotobial band';
    case 'rotatorCuff':
      return 'rotator cuff';
    case 'innerThigh':
      return 'inner thigh';
    case 'upperBody':
      return 'upper body';
    default:
      return muscle;
  }
};

// based off of https://www.omicsonline.org/articles-images/2157-7595-6-220-t003.html
export const difficultyToMET = (difficulty: number): number => {
  switch (difficulty) {
    case 1:
      return 4;
    case 2:
      return 7;
    case 3:
      return 10;
    default:
      return 2;
  }
};

export const getCaloriesBurned = (
  duration: number,
  MET: number,
  weight?: number,
) => {
  if (!weight) {
    return;
  }
  return ((duration / 60) * (MET * 3.5 * weight)) / 200;
};

export const getCaloriesBurnedFromAverageHeartRate = (
  duration: number,
  averageHeartRate: number,
  dob?: string,
  weight?: number,
  sex?: Gender,
) => {
  if (!weight || !sex || !dob) {
    return;
  }
  const age = moment().diff(dob, 'years');
  if (sex === 'male') {
    return (
      ((duration / 60) *
        (0.6309 * averageHeartRate +
          0.1988 * weight +
          0.2017 * age -
          55.0969)) /
      4.184
    );
  }
  return (
    ((duration / 60) *
      (0.4472 * averageHeartRate - 0.1263 * weight + 0.074 * age - 20.4022)) /
    4.184
  );
};

export const getDifficultyEmoji = (difficulty: number) => {
  if (difficulty < 2) {
    return '😊';
  }
  if (difficulty < 4) {
    return '😐';
  }
  if (difficulty < 7) {
    return '😮‍💨';
  }
  if (difficulty < 9) {
    return '😰';
  }
  if (difficulty < 10) {
    return '🤢';
  }
  return '🤮';
};

export const getDifficultyText = (difficulty: number) => {
  if (difficulty === 0) {
    return 'Easy';
  }
  if (difficulty === 1) {
    return 'Moderate';
  }
  if (difficulty === 2) {
    return 'Hard';
  }
  return 'Very Hard';
};

export const equipmentItemReadableString = (item: Equipment) => {
  switch (item) {
    case Equipment.PLYOMETRIC_BOX:
      return 'Plyometric box';
    case Equipment.CABLE_MACHINES:
      return 'Cable machines';
    case Equipment.PULL_UP_BAR:
      return 'Pull up bar';
    case Equipment.SQUAT_RACK:
      return 'Squat rack';
    case Equipment.EXERCISE_BALL:
      return 'Exercise ball';
    case Equipment.BOSU_BALL:
      return 'Bosu ball';
    case Equipment.AGILITY_LADDER:
      return 'Agility ladder';
    case Equipment.TRX_SUSPENSION_TRAINER:
      return 'TRX suspension trainer';
    case Equipment.MEDICINE_BALLS:
      return 'Medicine balls';
    case Equipment.EXERCISE_STEP:
      return 'Exercise step';
    case Equipment.FOAM_ROLLER:
      return 'Foam roller';
    default:
      return capitalizeFirstLetter(item);
  }
};

export const shareWorkout = async (workout: Exercise[], name: string) => {
  const url = `https://healthandmovement.page.link/?link=https://healthandmovement/workout${encodeURIComponent(
    `?exercises=${workout.map(exercise => exercise.id).join(',')}`,
  )}&apn=com.healthandmovement&isi=1506679389&ibi=com.HealthAndMovement`;

  try {
    const {action} = await Share.share({
      title: `${name} has shared a CA Health workout with you`,
      url,
      message: `${name} has shared a CA Health workout with you, click the link to view the workout: ${url}`,
    });
    if (action === 'sharedAction') {
      Snackbar.show({text: 'Workout shared successfully'});
    }
  } catch (e) {
    Snackbar.show({text: 'Error sharing workout'});
    logError(e);
  }
};

export const getEquipmentList = (exercises: Exercise[]) => {
  const equipment = exercises.reduce((acc: Equipment[], cur) => {
    if (cur?.equipment) {
      return [...acc, ...cur.equipment];
    }
    return acc;
  }, []);

  return _.uniq(equipment.map(item => equipmentItemReadableString(item)));
};

export const getMusclesList = (exercises: Exercise[]) => {
  const muscles = exercises.reduce((acc: Muscle[], cur) => {
    if (cur.muscles && cur.musclesSecondary) {
      return [...acc, ...cur.muscles, ...cur.musclesSecondary];
    }
    if (cur.muscles) {
      return [...acc, ...cur.muscles];
    }
    if (cur.musclesSecondary) {
      return [...acc, ...cur.musclesSecondary];
    }
    return acc;
  }, []);
  return _.uniq(muscles.map(item => muscleReadableString(item)));
};
