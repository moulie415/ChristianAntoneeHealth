import {SafeAreaView, useWindowDimensions, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {MyRootState, Plan as PlanType} from '../../../types/Shared';
import {connect} from 'react-redux';
import Profile, {PlanStatus} from '../../../types/Profile';
import Button from '../../commons/Button';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {requestPlan, setViewedPlan} from '../../../actions/profile';
import Text from '../../commons/Text';
import {Layout, Spinner} from '@ui-kitten/components';
import DevicePixels from '../../../helpers/DevicePixels';
import {getPlan} from '../../../actions/plan';
import moment from 'moment';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Daily from './Daily';
import Weekly from './Weekly';
import Monthly from './Monthly';
import colors from '../../../constants/colors';

const renderScene = SceneMap({
  daily: Daily,
  weekly: Weekly,
  monthly: Monthly,
});

const Plan: React.FC<{
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'Plan'>;
  requestPlan: () => void;
  loading: boolean;
  setViewedPlan: () => void;
  getPlan: () => void;
  plan: PlanType;
}> = ({
  profile,
  navigation,
  requestPlan: requestPlanAction,
  loading,
  setViewedPlan: setViewedPlanAction,
  getPlan: getPlanAction,
  plan,
}) => {
  useEffect(() => {
    setViewedPlanAction();
    getPlanAction();
  }, [setViewedPlanAction, getPlanAction]);

  const hasPlanLeft = useMemo(() => {
    return (
      plan &&
      (plan.workouts?.some(workout =>
        workout.dates.find(date =>
          moment(date).isAfter(moment().startOf('day')),
        ),
      ) ||
        plan.tests?.some(test =>
          test.dates.find(date =>
            moment(date).isAfter(moment().startOf('day')),
          ),
        ))
    );
  }, [plan]);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'daily', title: 'Daily'},
    {key: 'weekly', title: 'Weekly'},
    {key: 'monthly', title: 'Monthly'},
  ]);

  return (
    <SafeAreaView style={{flex: 1}}>
      {hasPlanLeft ? (
        <TabView
          renderTabBar={props => {
            return (
              <TabBar
                {...props}
                labelStyle={{textTransform: 'none', color: colors.appBlack}}
                style={{backgroundColor: colors.appWhite}}
                indicatorStyle={{backgroundColor: colors.appBlue}}
              />
            );
          }}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      ) : (
        <>
          <Text
            category="h4"
            style={{textAlign: 'center', margin: DevicePixels[20]}}>
            My workout plan
          </Text>

          {profile.planStatus === PlanStatus.UNINITIALIZED && (
            <View style={{margin: DevicePixels[10]}}>
              <Text>
                This is your the screen for your personal customized plan, once
                requested we will try and get your plan to you as soon as we can
                and once completed it will appear here
              </Text>
            </View>
          )}

          {profile.planStatus === PlanStatus.PENDING && (
            <View style={{margin: DevicePixels[10], alignItems: 'center'}}>
              <Text style={{marginBottom: DevicePixels[10]}}>
                Your plan is currently pending we will notify you when it
                becomes available
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
            {!profile.premium &&
              profile.planStatus === PlanStatus.UNINITIALIZED && (
                <Button
                  style={{margin: DevicePixels[20], marginTop: 0}}
                  disabled={loading}
                  accessoryLeft={() => (loading ? <Spinner /> : null)}
                  onPress={() => {
                    navigation.navigate('Premium', {
                      onActivated: () => {
                        navigation.navigate('Home');
                      },
                    });
                  }}>
                  No thanks, I just want premium
                </Button>
              )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  loading: profile.loading,
  plan: profile.plan,
});

const mapDispatchToProps = {
  requestPlan,
  setViewedPlan,
  getPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
