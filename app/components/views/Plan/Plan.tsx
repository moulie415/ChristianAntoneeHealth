import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
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
import Purchases, {
  PurchaserInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import {logError} from '../../../helpers/error';

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
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [info, setInfo] = useState<PurchaserInfo>();
  useEffect(() => {
    setViewedPlanAction();
    getPlanAction();
  }, [setViewedPlanAction, getPlanAction]);

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const purchaserInfo = await Purchases.getPurchaserInfo();
        setInfo(purchaserInfo);
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(
            offerings.current.availablePackages.filter(
              p => p.packageType === 'CUSTOM',
            ),
          );
        }
      } catch (e) {
        Alert.alert('Error fetching Premium offerings', e.message);
        logError(e);
      }
    };
    getOfferings();
  }, []);

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
        <ImageBackground
          style={{flex: 1}}
          source={require('../../../images/christian.webp')}>
          <>
            <Layout
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#000',
                opacity: 0.5,
              }}
            />
            <Text
              category="h4"
              style={{
                textAlign: 'center',
                margin: DevicePixels[20],
                color: '#fff',
              }}>
              My workout plan
            </Text>

            {(profile.planStatus === PlanStatus.UNINITIALIZED ||
              !hasPlanLeft) && (
              <View style={{margin: DevicePixels[20], marginTop: 0}}>
                <Text style={{lineHeight: 25, color: '#fff'}}>
                  This is your the screen for your personal customized plan,
                  once requested we will try and get your plan to you as soon as
                  we can and once completed it will appear here.
                  <Text style={{fontWeight: 'bold', color: '#fff'}}>
                    {' '}
                    Get your first plan free!!
                  </Text>
                </Text>
              </View>
            )}

            {profile.planStatus === PlanStatus.PENDING && (
              <View style={{margin: DevicePixels[10], alignItems: 'center'}}>
                <Text style={{marginBottom: DevicePixels[10], color: '#fff'}}>
                  Your plan is currently{' '}
                  <Text style={{fontWeight: 'bold', color: colors.appWhite}}>
                    PENDING
                  </Text>{' '}
                  we will notify you when it becomes available
                </Text>
                <Spinner style={{borderColor: '#fff'}} size="giant" />
              </View>
            )}
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {profile.planStatus !== PlanStatus.PENDING &&
                !hasPlanLeft &&
                packages.map(p => {
                  return (
                    <Button
                      key={p.identifier}
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
                      {`Request my workout plan ${
                        profile.usedFreePlan
                          ? '(' + p.product.price_string + ')'
                          : ''
                      }`}
                    </Button>
                  );
                })}

              {!profile.premium &&
                profile.planStatus !== PlanStatus.PENDING &&
                !hasPlanLeft && (
                  <Button
                    style={{
                      margin: DevicePixels[20],
                      marginTop: 0,
                    }}
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
        </ImageBackground>
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
