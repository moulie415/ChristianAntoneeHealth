import {View} from 'react-native';
import React from 'react';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile, {PlanStatus} from '../../types/Profile';
import Button from '../commons/Button';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {requestPlan} from '../../actions/profile';
import Text from '../commons/Text';
import {Spinner} from '@ui-kitten/components';

const Plan: React.FC<{
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'Plan'>;
  requestPlan: () => void;
}> = ({profile, navigation, requestPlan: requestPlanAction}) => {
  return (
    <View>
      <Text>Plan</Text>
      {profile.planStatus === PlanStatus.PENDING && (
        <View>
          <Text>
            Your plan is currently pending we will notify you when it becomes
            available
          </Text>
          <Spinner />
        </View>
      )}
      {profile.planStatus === PlanStatus.UNINITIALIZED && (
        <Button
          onPress={() => {
            if (profile.premium) {
              requestPlanAction();
            } else {
              navigation.navigate('Premium', {
                onActivated: () => {
                  requestPlanAction();
                },
              });
            }
          }}>
          Request my plan
        </Button>
      )}
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  requestPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
