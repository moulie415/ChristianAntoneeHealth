import Exercise from '../types/Exercise';
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
