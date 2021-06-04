import {Spinner} from '@ui-kitten/components';
import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import globalStyles from '../../styles/globalStyles';

const AbsoluteSpinner: FunctionComponent<{loading: boolean}> = ({loading}) => {
  if (loading) {
    return (
      <View style={globalStyles.spinner}>
        <Spinner size="large" />
      </View>
    );
  }
  return null;
};

export default AbsoluteSpinner;
