import React from 'react';
import {View, ViewStyle} from 'react-native';
import colors from '../../constants/colors';
import globalStyles from '../../styles/globalStyles';
import Spinner from './Spinner';
import Text from './Text';

const AbsoluteSpinner: React.FC<{
  loading: boolean;
  text?: string;
  style?: ViewStyle;
}> = ({loading, text, style}) => {
  if (loading) {
    return (
      <View style={[globalStyles.spinner, style]}>
        <Spinner />
        {!!text && <Text style={{color: colors.appWhite}}>{text}</Text>}
      </View>
    );
  }
  return null;
};

export default AbsoluteSpinner;
