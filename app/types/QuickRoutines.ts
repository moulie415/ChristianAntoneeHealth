import {Level} from './Shared';

export type Area = 'upper' | 'lower' | 'full' | 'core';
export type Equipment = 'full' | 'minimal' | 'none';
export type Focus = 'strength' | 'mobility' | 'balance' | 'intensity';

export default interface QuickRoutine {
  id: string;
  name: string;
  area: Area;
  duration: number;
  equipment: Equipment;
  focus: Focus;
  level: Level;
  premium: boolean;
  exerciseIds: string[];
  thumbnail?: {src: string; title: string};
};
