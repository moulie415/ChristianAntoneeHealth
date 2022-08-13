import {SwitchProps, Switch} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';

const Toggle: React.FC<SwitchProps> = props => {
  return (
    <Switch
      {...props}
      thumbColor={props.value ? colors.appBlack : colors.secondaryDark}
      trackColor={{false: colors.appBlack, true: colors.secondaryDark}}
    />
  );
};

export default Toggle;
