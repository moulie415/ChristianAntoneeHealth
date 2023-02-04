import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {MutableRefObject, useEffect, useMemo, useState} from 'react';
import {MyRootState, Plan as PlanType} from '../../../types/Shared';
import {connect} from 'react-redux';
import Profile, {PlanStatus} from '../../../types/Profile';
import Button from '../../commons/Button';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {requestPlan, setViewedPlan} from '../../../actions/profile';
import Text from '../../commons/Text';

import {getPlan} from '../../../actions/plan';
import moment from 'moment';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Daily from './Daily';
import Weekly from './Weekly';
import Monthly from './Monthly';
import colors from '../../../constants/colors';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import {logError} from '../../../helpers/error';
import Spinner from '../../commons/Spinner';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Header from '../../commons/Header';
import Drawer from 'react-native-drawer';

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
  drawerRef: MutableRefObject<Drawer>;
}> = ({
  profile,
  navigation,
  requestPlan: requestPlanAction,
  loading,
  setViewedPlan: setViewedPlanAction,
  getPlan: getPlanAction,
  plan,
  drawerRef,
}) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [info, setInfo] = useState<CustomerInfo>();
  useEffect(() => {
    setViewedPlanAction();
    getPlanAction();
  }, [setViewedPlanAction, getPlanAction]);

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const purchaserInfo = await Purchases.getCustomerInfo();
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
        workout.dates.find(
          date =>
            moment(date).isAfter(moment().startOf('day')) ||
            moment(date).isSame(moment().startOf('day')),
        ),
      ) ||
        plan.tests?.some(test =>
          test.dates.find(
            date =>
              moment(date).isAfter(moment().startOf('day')) ||
              moment(date).isSame(moment().startOf('day')),
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
    <>
      {hasPlanLeft ? (
        <View style={{flex: 1, backgroundColor: colors.appGrey}}>
          <SafeAreaView style={{flex: 1}}>
            <Header drawerRef={drawerRef} />
            <TabView
              renderTabBar={props => {
                return (
                  <TabBar
                    {...props}
                    renderTabBarItem={props => {
                      return (
                        <TouchableOpacity
                          key={props.key}
                          onPress={props.onPress}>
                          <LinearGradient
                            colors={
                              props.key === routes[index].key
                                ? [colors.appBlueLight, colors.appBlueDark]
                                : ['transparent', 'transparent']
                            }
                            style={{
                              height: 45,
                              paddingHorizontal: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 25,
                            }}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                              }}>
                              {props.route?.title}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    }}
                    labelStyle={{
                      textTransform: 'none',
                      color: colors.appBlack,
                    }}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    contentContainerStyle={{
                      marginVertical: 20,
                      justifyContent: 'space-evenly',
                    }}
                    indicatorStyle={{backgroundColor: 'transparent'}}
                  />
                );
              }}
              lazy
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
            />
          </SafeAreaView>
        </View>
      ) : (
        <FastImage
          style={{flex: 1}}
          source={require('../../../images/christian.webp')}>
          <SafeAreaView style={{flex: 1}}>
            <Header drawerRef={drawerRef} />
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#000',
                opacity: 0.7,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                margin: 20,
                marginTop: 0,
                color: '#fff',
              }}>
              My workout plan
            </Text>

            {(profile.planStatus === PlanStatus.UNINITIALIZED ||
              !hasPlanLeft) && (
              <View style={{margin: 20, marginTop: 0}}>
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
              <View style={{margin: 10, alignItems: 'center'}}>
                <Text style={{marginBottom: 10, color: '#fff'}}>
                  Your plan is currently{' '}
                  <Text style={{fontWeight: 'bold', color: colors.appWhite}}>
                    PENDING
                  </Text>{' '}
                  we will notify you when it becomes available
                </Text>
                <Spinner style={{borderColor: '#fff'}} />
              </View>
            )}
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {profile.planStatus !== PlanStatus.PENDING &&
                !hasPlanLeft &&
                packages.map(p => {
                  return (
                    <Button
                      key={p.identifier}
                      style={{margin: 20}}
                      disabled={loading}
                      text={`Request workout plan ${
                        profile.usedFreePlan
                          ? '(' + p.product.priceString + ')'
                          : ''
                      }`}
                      loading={loading}
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
                      }}
                    />
                  );
                })}

              {!profile.premium &&
                profile.planStatus !== PlanStatus.PENDING &&
                !hasPlanLeft && (
                  <Button
                    style={{
                      margin: 20,
                      marginTop: 0,
                    }}
                    disabled={loading}
                    text="No thanks, I just want premium"
                    loading={loading}
                    onPress={() => {
                      navigation.navigate('Premium', {
                        onActivated: () => {
                          navigation.navigate('Home');
                        },
                      });
                    }}
                  />
                )}
            </View>
          </SafeAreaView>
        </FastImage>
      )}
    </>
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
