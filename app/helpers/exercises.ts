import Exercise, {Muscle, MuscleHighlight} from '../types/Exercise';
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
      case
    }
  });
  return muscleArr;
};
