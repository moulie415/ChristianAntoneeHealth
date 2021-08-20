import {Layout} from '@ui-kitten/components';
import React from 'react';
import globalStyles from '../../styles/globalStyles';
import Spinner from 'react-native-spinkit';
import colors from '../../constants/colors';

const Loading = () => {
  return (
    <Layout style={globalStyles.spinner}>
      <Spinner type="ChasingDots" color={colors.appBlue} />
    </Layout>
  );
};

export default Loading;
