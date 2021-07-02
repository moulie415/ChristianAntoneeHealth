import {Level, Type, StrengthArea, Location, FlexibilityArea} from './Shared';

export default interface Exercise {
  id?: string;
  name: string;
  description: string;
  level: Level;
  type: Type;
  area?: StrengthArea;
  flexibilityArea?: FlexibilityArea;
  location: Location;
  muscles?: Muscle[];
  live?: boolean;
  premium?: boolean;
  reps?: number;
  sets?: number;
  resistance?: number;
}

export type Muscle =
  | 'chest'
  | 'upperBack'
  | 'midBack'
  | 'lowBack'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'abdominals'
  | 'obliques'
  | 'leg'
  | 'gluteals'
  | 'hamstrings'
  | 'quadriceps'
  | 'calves'
  | 'hipFlexors'
  | 'iliotibialBand'
  | 'rotatorCuff'
  | 'innerThigh'
  | 'all'
  | 'upperBody'
  | 'arms';

export type MuscleHighlight =
  // Back
  | 'trapezius'
  | 'upper-back'
  | 'lower-back'

  // Chest
  | 'chest'

  // Arms
  | 'biceps'
  | 'triceps'
  | 'forearm'
  | 'back-deltoids'
  | 'front-deltoids'

  // Abs
  | 'abs'
  | 'obliques'

  // Legs
  | 'adductor'
  | 'hamstring'
  | 'quadriceps'
  | 'abductors'
  | 'calves'
  | 'gluteal'

  // Head
  | 'head'
  | 'neck';

export const allMuscleHighlights: MuscleHighlight[] = [
  // Back
  'trapezius',
  'upper-back',
  'lower-back',

  // Chest
  'chest',

  // Arms
  'biceps',
  'triceps',
  'forearm',
  'back-deltoids',
  'front-deltoids',

  // Abs
  'abs',
  'obliques',

  // Legs
  'adductor',
  'hamstring',
  'quadriceps',
  'abductors',
  'calves',
  'gluteal',

  // Head
  'head',
  'neck',
];
