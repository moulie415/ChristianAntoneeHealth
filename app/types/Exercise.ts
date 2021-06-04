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
  muscles?: string[];
  live?: boolean;
  premium?: boolean;
  reps?: number;
  sets?: number;
};
