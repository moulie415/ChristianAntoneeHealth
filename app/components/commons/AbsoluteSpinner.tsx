import {Layout, Spinner} from '@ui-kitten/components';
import React from 'react';
import globalStyles from '../../styles/globalStyles';
import Text from './Text';

const AbsoluteSpinner: React.FC<{loading: boolean; text?: string}> = ({
  loading,
  text,
}) => {
  if (loading) {
    return (
      <Layout style={globalStyles.spinner}>
        <Spinner size="large" />
        {!!text && <Text>{text}</Text>}
      </Layout>
    );
  }
  return null;
};

export default AbsoluteSpinner;
