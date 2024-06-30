import Exercise from '../types/Exercise';
import {getWorkoutDurationRounded} from './getWorkoutDurationRounded';

describe('getWorkoutDurationRounded', () => {
  it('should return 0 if no exercises are provided', () => {
    expect(getWorkoutDurationRounded()).toBe(0);
  });

  it('should return the rounded duration for a single exercise without prep time', () => {
    const exercises: Exercise[] = [{time: 30} as Exercise];
    expect(getWorkoutDurationRounded(exercises)).toBe(5);
  });

  it('should return the rounded duration for a single exercise with prep time', () => {
    const exercises: Exercise[] = [{time: 30} as Exercise];
    expect(getWorkoutDurationRounded(exercises, 10)).toBe(5);
  });

  it('should return the rounded duration for multiple exercises without prep time', () => {
    const exercises: Exercise[] = [
      {time: 30},
      {time: 45},
      {time: 60},
      {time: 30},
      {time: 40},
      {time: 45},
      {time: 40},
      {time: 50},
      {time: 30},
    ] as Exercise[];
    expect(getWorkoutDurationRounded(exercises)).toBe(10);
  });

  it('should return the rounded duration for multiple exercises with prep time', () => {
    const exercises: Exercise[] = [{time: 30}, {time: 45}] as Exercise[];
    expect(getWorkoutDurationRounded(exercises, 10)).toBe(5);
  });

  it('should handle an exercise with zero time correctly', () => {
    const exercises: Exercise[] = [{time: 0} as Exercise];
    expect(getWorkoutDurationRounded(exercises)).toBe(0);
  });

  it('should handle an exercise with undefined time correctly', () => {
    const exercises: Exercise[] = [{time: undefined} as Exercise];
    expect(getWorkoutDurationRounded(exercises)).toBe(0);
  });

  it('should handle a mix of defined and undefined times correctly', () => {
    const exercises: Exercise[] = [
      {time: 30} as Exercise,
      {time: undefined} as Exercise,
    ];
    expect(getWorkoutDurationRounded(exercises, 10)).toBe(5);
  });
});
