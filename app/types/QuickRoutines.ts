import {Level} from './Shared';

export type Area = 'upper' | 'lower' | 'full';
export type Equipment = 'full' | 'minimal' | 'none';

export default interface QuickRoutine {
  id: string;
  name: string;
  area: Area;
  equipment: Equipment;
  level: Level;
  premium: boolean;
  exerciseIds:
    | string[]
    | {
        id: string;
        prepTime?: number;
        weight?: string;
        notes?: string;
        time?: number;
      }[];
  thumbnail?: {src: string; title: string};
  preview?: {src: string; title: string};
  disableWorkoutMusic: boolean;
}
