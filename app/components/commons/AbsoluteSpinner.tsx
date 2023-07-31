import React from 'react';
import {View} from 'react-native';
import globalStyles from '../../styles/globalStyles';
import Spinner from './Spinner';
import Text from './Text';
import colors from '../../constants/colors';

const AbsoluteSpinner: React.FC<{loading: boolean; text?: string}> = ({
  loading,
  text,
}) => {
  if (loading) {
    return (
      <View style={globalStyles.spinner}>
        <Spinner />
        {!!text && <Text style={{color: colors.appWhite}}>{text}</Text>}
      </View>
    );
  }
  return null;
};

export default AbsoluteSpinner;
