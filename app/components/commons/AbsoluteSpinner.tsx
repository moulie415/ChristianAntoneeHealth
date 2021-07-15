import {Layout, Spinner} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import globalStyles from '../../styles/globalStyles';

const AbsoluteSpinner: React.FC<{loading: boolean}> = ({loading}) => {
  if (loading) {
    return (
      <Layout style={globalStyles.spinner}>
        <Spinner size="large" />
      </Layout>
    );
  }
  return null;
};

export default AbsoluteSpinner;
