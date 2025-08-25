import { Area } from './QuickRoutines';
import {
  CoolDown,
  Equipment as EquipmentItem,
  FlexibilityArea,
  Goal,
  Level,
  WarmUp,
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
  level?: Level;
  type?: Goal;
  area?: Area;
  flexibilityArea?: FlexibilityArea;
  equipment?: EquipmentItem[];
  muscles?: Muscle[];
  musclesSecondary?: Muscle[];
  warmUp?: WarmUp;
  coolDown?: CoolDown;
  live?: boolean;
  premium?: boolean;
  reps?: string;
  sets?: string;
  thumbnail?: Thumbnail;
  video?: Video;
  notes?: string;
  weight?: string;
  time?: number;
  prepTime?: number;
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
