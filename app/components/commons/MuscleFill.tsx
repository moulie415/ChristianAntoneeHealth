import React from 'react';
import {Muscle} from '../../types/Exercise';
import {Path} from 'react-native-svg';
import colors from '../../constants/colors';
import {
  abdominals,
  allBack,
  allFront,
  biceps,
  calves,
  chest,
  glutes,
  hamstrings,
  hipFlexors,
  innerThighs,
  lowerBack,
  midUpperBack,
  obliques,
  quads,
  shoulders,
  triceps,
  upperBodyBack,
  upperBodyFront,
} from '../../constants/musclePaths';

const getMuscle = (m: Muscle, back?: boolean) => {
  switch (m) {
    case 'abdominals':
      return abdominals;
    case 'biceps':
      return biceps;
    case 'calves':
      return calves;
    case 'chest':
      return chest;
    case 'gluteals':
      return glutes;
    case 'hamstrings':
      return hamstrings;
    case 'hipFlexors':
      return hipFlexors;
    case 'innerThigh':
      return innerThighs;
    case 'lowBack':
      return lowerBack;
    case 'midBack':
    case 'upperBack':
      return midUpperBack;
    case 'obliques':
      return obliques;
    case 'quadriceps':
      return quads;
    case 'shoulders':
      return shoulders;
    case 'triceps':
      return triceps;
    case 'all':
      return back ? allBack : allFront;
    case 'arms':
      return back ? triceps : biceps;
    case 'upperBody':
      return back ? upperBodyBack : upperBodyFront;
  }
};

const MuscleFill: React.FC<{
  muscle: Muscle;
  secondary?: boolean;
  back?: boolean;
}> = ({muscle, back, secondary}) => {
  return (
    <>
      {getMuscle(muscle, back).map(d => {
        return (
          <Path
            key={d}
            fill={secondary ? colors.muscleSecondary : colors.musclePrimary}
            d={d}
          />
        );
      })}
    </>
  );
};

export default MuscleFill;
