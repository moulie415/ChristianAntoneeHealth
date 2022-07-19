import {Spinner} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import globalStyles from '../../styles/globalStyles';
import Text from './Text';

const AbsoluteSpinner: React.FC<{loading: boolean; text?: string}> = ({
  loading,
  text,
}) => {
  if (loading) {
    return (
      <View style={globalStyles.spinner}>
        <Spinner size="large" />
        {!!text && <Text>{text}</Text>}
      </View>
    );
  }
  return null;
};

export default AbsoluteSpinner;
