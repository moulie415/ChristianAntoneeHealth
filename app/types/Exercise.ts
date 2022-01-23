import {
  Level,
  Goal,
  StrengthArea,
  FlexibilityArea,
  CardioType,
  WarmUp,
  CoolDown,
  Equipment as EquipmentItem,
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
  area?: StrengthArea;
  cardioType?: CardioType;
  flexibilityArea?: FlexibilityArea;
  equipment?: EquipmentItem[];
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
