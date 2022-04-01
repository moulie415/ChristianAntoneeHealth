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
import {Layout, Spinner} from '@ui-kitten/components';
import DevicePixels from '../../helpers/DevicePixels';

const Plan: React.FC<{
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'Plan'>;
  requestPlan: () => void;
  loading: boolean;
}> = ({profile, navigation, requestPlan: requestPlanAction, loading}) => {
  return (
    <Layout style={{flex: 1}}>
      <Text
        category="h4"
        style={{textAlign: 'center', margin: DevicePixels[20]}}>
        My workout plan
      </Text>

      {profile.planStatus === PlanStatus.UNINITIALIZED && (
        <View style={{margin: DevicePixels[10]}}>
          <Text>
            This is your the screen for your personal customized plan, once
            requested we will try and get your plan to you as soon as we can and
            once completed it will appear here
          </Text>
        </View>
      )}

      {profile.planStatus === PlanStatus.PENDING && (
        <View style={{margin: DevicePixels[10], alignItems: 'center'}}>
          <Text style={{marginBottom: DevicePixels[10]}}>
            Your plan is currently pending we will notify you when it becomes
            available
          </Text>
          <Spinner />
        </View>
      )}
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        {profile.planStatus === PlanStatus.UNINITIALIZED && (
          <Button
            style={{margin: DevicePixels[20]}}
            disabled={loading}
            accessoryLeft={() => (loading ? <Spinner /> : null)}
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
            Request my workout plan
          </Button>
        )}
      </View>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  loading: profile.loading,
});

const mapDispatchToProps = {
  requestPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
