import {View, Text} from 'react-native';
import React from 'react';
import {MyRootState, Plan} from '../../../types/Shared';
import {connect} from 'react-redux';
import * as _ from 'lodash';

const Monthly: React.FC<{plan: Plan}> = ({plan}) => {
  
  return <View />;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
});

export default connect(mapStateToProps)(Monthly);
