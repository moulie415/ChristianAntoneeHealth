import Exercise from '../types/Exercise';
import { PlanExercise } from '../types/Shared';

function round5(x: number) {
  return Math.ceil(x / 5) * 5;
}

export const getWorkoutDurationRounded = (
  exercises?: PlanExercise[] | Exercise[],
  prepTime?: number,
): number => {
  let total = 0;
  for (let i = 0; i < (exercises?.length || 0); i++) {
    const exercise = exercises?.[i];
    if (exercise) {
      total += (exercise.time || 0) + (prepTime || 0);
    }
  }
  return round5(total / 60);
};
