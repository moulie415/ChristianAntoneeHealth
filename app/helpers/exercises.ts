import {Share} from 'react-native';
import {capitalizeFirstLetter} from '.';
import {STORE_LINK} from '../constants';
import Exercise, {
  allMuscleHighlights,
  Muscle,
  MuscleHighlight,
} from '../types/Exercise';
import {Unit} from '../types/Profile';
import {Equipment, Level} from '../types/Shared';

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

export const mapMuscleToHighlight = (muscles: Muscle[]): MuscleHighlight[] => {
  const muscleArr: MuscleHighlight[] = [];
  muscles.forEach(muscle => {
    switch (muscle) {
      case 'chest':
        muscleArr.push('chest');
        break;
      case 'upperBack':
        muscleArr.push('upper-back');
        break;
      case 'midBack':
        break;
      case 'lowBack':
        muscleArr.push('lower-back');
        break;
      case 'shoulders':
        muscleArr.push('front-deltoids');
        break;
      case 'biceps':
        muscleArr.push('biceps');
        break;
      case 'triceps':
        muscleArr.push('triceps');
        break;
      case 'abdominals':
        muscleArr.push('abs');
        break;
      case 'obliques':
        muscleArr.push('obliques');
        break;
      case 'leg':
        muscleArr.push('hamstring');
        muscleArr.push('quadriceps');
        muscleArr.push('calves');
        break;
      case 'gluteals':
        muscleArr.push('gluteal');
        break;
      case 'hamstrings':
        muscleArr.push('hamstring');
        break;
      case 'quadriceps':
        muscleArr.push('quadriceps');
        break;
      case 'calves':
        muscleArr.push('calves');
        break;
      case 'hipFlexors':
        muscleArr.push('adductor');
        muscleArr.push('abductors');
        break;
      case 'iliotibialBand':
        break;
      case 'rotatorCuff':
        muscleArr.push('front-deltoids');
        break;
      case 'all':
        muscleArr.push(...allMuscleHighlights);
        break;
      case 'upperBody':
        muscleArr.push('trapezius');
        muscleArr.push('upper-back');
        muscleArr.push('lower-back');
        muscleArr.push('chest');
        muscleArr.push('biceps');
        muscleArr.push('triceps');
        muscleArr.push('forearm');
        muscleArr.push('back-deltoids');
        muscleArr.push('front-deltoids');
        muscleArr.push('abs');
        muscleArr.push('obliques');
        break;
      case 'arms':
        muscleArr.push('biceps');
        muscleArr.push('triceps');
        muscleArr.push('forearm');
        break;
    }
  });
  return muscleArr;
};

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
  weight: number,
  unit: Unit,
) => {
  return (
    ((duration / 60) *
      (MET * 3.5 * (unit === 'metric' ? weight : weight / 2.205))) /
    200
  );
};

export const getDifficultyEmoji = (difficulty: number) => {
  if (difficulty === 0) {
    return '😊';
  }
  if (difficulty === 1) {
    return '😐';
  }
  if (difficulty === 2) {
    return '😰';
  }
  return '🤢';
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
    default:
      return capitalizeFirstLetter(item);
  }
};

export const shareWorkout = (workout: Exercise[], name: string) => {
  const url = `https://healthandmovement.page.link/?link=https://healthandmovement/workout?exercises=${workout
    .map(exercise => exercise.id)
    .join(
      ',',
    )}&apn=com.healthandmovement&isi=1506679389&ibi=com.HealthAndMovement`;
  Share.share({
    title: `${name} has shared a Health and Movement workout with you`,
    url,
    message: `${name} has shared a Health and Movement workout with you, click the link to view the workout: ${url}`,
  });
};
