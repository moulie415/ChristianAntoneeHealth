import React from 'react';
import {Switch, SwitchProps} from 'react-native';
import colors from '../../constants/colors';

const Toggle: React.FC<SwitchProps> = props => {
  return (
    <Switch
      {...props}
      thumbColor={props.value ? colors.appGrey : colors.appBlue}
      trackColor={{false: colors.appGrey, true: colors.appBlue}}
    />
  );
};

export default Toggle;
