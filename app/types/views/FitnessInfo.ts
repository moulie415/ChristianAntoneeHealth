import {Gender, Unit} from '../Shared';

export default interface FitnessInfoProps {
  height?: number;
  setHeight: (height: number) => void;
  weight?: number;
  setWeight: (weight: number) => void;
  gender?: Gender;
  setGender: (gender: Gender) => void;
  dob: string;
  setDob: (dob: string) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
}
