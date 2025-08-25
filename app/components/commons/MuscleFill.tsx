import React from 'react';
import { Path } from 'react-native-svg';
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
  legsBack,
  legsFront,
  lowerBack,
  midBack,
  midUpperBack,
  obliques,
  quads,
  shoulders,
  triceps,
  upperBodyBack,
  upperBodyFront,
} from '../../constants/musclePaths';
import { Muscle } from '../../types/Exercise';
import { Gender } from '../../types/Shared';

const getMuscle = (m: Muscle, gender?: Gender, back?: boolean) => {
  switch (m) {
    case 'abdominals':
      return abdominals(gender);
    case 'biceps':
      return biceps(gender);
    case 'calves':
      return calves(gender);
    case 'chest':
      return chest(gender);
    case 'gluteals':
      return glutes(gender);
    case 'hamstrings':
      return hamstrings(gender);
    case 'hipFlexors':
      return hipFlexors(gender);
    case 'innerThigh':
      return innerThighs(gender);
    case 'lowBack':
      return lowerBack(gender);
    case 'midBack':
      return midBack(gender);
    case 'upperBack':
      return midUpperBack(gender);
    case 'obliques':
      return obliques(gender);
    case 'quadriceps':
      return quads(gender);
    case 'shoulders':
      return shoulders(gender);
    case 'triceps':
      return triceps(gender);
    case 'all':
      return back ? allBack(gender) : allFront(gender);
    case 'arms':
      return back ? triceps(gender) : biceps(gender);
    case 'upperBody':
      return back ? upperBodyBack(gender) : upperBodyFront(gender);
    case 'leg':
      return back ? legsBack(gender) : legsFront(gender);
  }
};

const MuscleFill: React.FC<{
  muscle: Muscle;
  secondary?: boolean;
  back?: boolean;
  gender?: Gender;
}> = ({ muscle, back, secondary, gender }) => {
  return (
    <>
      {getMuscle(muscle, gender, back)?.map(d => {
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
