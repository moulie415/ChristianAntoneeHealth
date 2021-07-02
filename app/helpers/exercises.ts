import Exercise, {allMuscleHighlights, Muscle, MuscleHighlight} from '../types/Exercise';
import {Level} from '../types/Shared';

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
