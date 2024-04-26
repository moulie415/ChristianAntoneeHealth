import React, {memo} from 'react';
import {View} from 'react-native';

import Svg from 'react-native-svg';
import {backMuscles, frontMuscles} from '../../helpers/exercises';
import {Muscle} from '../../types/Exercise';
import {Gender} from '../../types/Shared';
import MuscleFill from './MuscleFill';
import MusclesFemaleBack from './MusclesFemaleBack';
import MusclesFemaleFront from './MusclesFemaleFront';
import MusclesMaleBack from './MusclesMaleBack';
import MusclesMaleFront from './MusclesMaleFront';

const MusclesDiagram: React.FC<{
  primary?: Muscle[];
  secondary?: Muscle[];
  gender?: Gender;
}> = ({primary, secondary, gender}) => {
  const front = (primary || []).filter(m => frontMuscles.includes(m));

  const frontSecondary = (secondary || []).filter(m =>
    frontMuscles.includes(m),
  );

  const back = (primary || []).filter(m => backMuscles.includes(m));

  const backSecondary = (secondary || []).filter(m => backMuscles.includes(m));

  const hasFront = !!front.length || !!frontSecondary.length;
  const hasBack = !!back.length || !!backSecondary.length;

  return (
    <View style={{}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          borderRadius: 10,
        }}>
        {hasFront && (
          <Svg width="50%" height={200} viewBox="0 0 12.62 47.06">
            {front.map(m => (
              <MuscleFill key={m} muscle={m} gender={gender} />
            ))}
            {frontSecondary.map(m => (
              <MuscleFill key={m} muscle={m} secondary gender={gender} />
            ))}
            {gender === 'female' ? (
              <MusclesFemaleFront />
            ) : (
              <MusclesMaleFront />
            )}
          </Svg>
        )}
        {hasBack && (
          <Svg width="50%" height={200} viewBox="0 0 12.62 47.06">
            {back.map(m => (
              <MuscleFill key={m} muscle={m} back gender={gender} />
            ))}
            {backSecondary.map(m => (
              <MuscleFill key={m} muscle={m} secondary back gender={gender} />
            ))}
            {gender === 'female' ? <MusclesFemaleBack /> : <MusclesMaleBack />}
          </Svg>
        )}
      </View>
    </View>
  );
};

export default memo(MusclesDiagram);
