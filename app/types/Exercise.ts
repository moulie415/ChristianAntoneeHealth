import {Equipment} from './QuickRoutines';
import {
  Level,
  Goal,
  StrengthArea,
  Location,
  FlexibilityArea,
  CardioType,
  WarmUp,
  CoolDown,
} from './Shared';

export interface Thumbnail {
  src: string;
  title: string;
}

export interface Video {
  src: string;
  title: string;
}
export default interface Exercise {
  id?: string;
  name: string;
  description: string;
  level: Level;
  type: Goal;
  area?: StrengthArea;
  cardioType?: CardioType;
  flexibilityArea?: FlexibilityArea;
  location: Location;
  equipment?: Equipment[];
  muscles?: Muscle[];
  musclesSecondary?: Muscle[];
  warmUp?: WarmUp;
  coolDown?: CoolDown;
  live?: boolean;
  premium?: boolean;
  reps?: number;
  sets?: number;
  resistance?: number;
  thumbnail?: Thumbnail;
  video?: Video;
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
