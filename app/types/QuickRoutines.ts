import {Goal, Level} from './Shared';

export type Area = 'upper' | 'lower' | 'full';
export type Equipment = 'full' | 'minimal';

export default interface QuickRoutine {
  id: string;
  name: string;
  area: Area;
  duration: number;
  equipment: Equipment;
  focus: Goal;
  level: Level;
  premium: boolean;
  exerciseIds: string[];
  thumbnail?: {src: string; title: string};
  instructions?: string;
}
