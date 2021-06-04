import {Gender, HeightMetric, WeightMetric} from '../Profile';

export default interface FitnessInfoProps {
  height?: number;
  setHeight: (height: number) => void;
  weight?: number;
  setWeight: (weight: number) => void;
  gender?: Gender;
  setGender: (gender: Gender) => void;
  dob: string;
  setDob: (dob: string) => void;
  heightMetric: HeightMetric;
  setHeightMetric: (metric: HeightMetric) => void;
  weightMetric: WeightMetric;
  setWeightMetric: (metric: WeightMetric) => void;
  setStep: (step: number) => void;
};
