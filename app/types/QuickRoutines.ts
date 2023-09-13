import {Level} from './Shared';

export type Area = 'upper' | 'lower' | 'full';
export type Equipment = 'full' | 'minimal' | 'none';

export default interface QuickRoutine {
  id: string;
  name: string;
  area: Area;
  duration: number;
  equipment: Equipment;
  level: Level;
  premium: boolean;
  exerciseIds: string[];
  thumbnail?: {src: string; title: string};
  instructions?: string;
  steps?: string[];
  preview?: {src: string; title: string};
}
