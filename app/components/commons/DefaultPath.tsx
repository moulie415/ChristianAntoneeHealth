import React from 'react';
import {Path} from 'react-native-svg';
import colors from '../../constants/colors';

const DefaultPath: React.FC<{d: string}> = ({d}) => {
  return (
    <Path
      fill="none"
      stroke={colors.textGrey}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.2}
      d={d}
    />
  );
};

export default DefaultPath;
