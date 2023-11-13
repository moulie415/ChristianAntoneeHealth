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
import Profile from '../../../types/Profile';
import Button from '../../commons/Button';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
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
import {useFocusEffect} from '@react-navigation/native';
import {setRead} from '../../../actions/profile';
import {CLIENT_PREMIUM} from '../../../constants';
import isTestFlight from '../../../helpers/isTestFlight';

const renderScene = SceneMap({
  daily: Daily,
  weekly: Weekly,
  monthly: Monthly,
});

const Plan: React.FC<{
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'Plan'>;
  loading: boolean;
  getPlan: () => void;
  plan?: PlanType;
  setRead: (key: string) => void;
}> = ({
  profile,
  navigation,
  loading,
  getPlan: getPlanAction,
  plan,
  setRead: setReadAction,
}) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [info, setInfo] = useState<CustomerInfo>();
  useEffect(() => {
    getPlanAction();
  }, [getPlanAction]);

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
        // @ts-ignore
        Alert.alert('Error fetching Premium offerings', e.message);
        logError(e);
      }
    };
    getOfferings();
  }, []);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'daily', title: 'Daily'},
    {key: 'weekly', title: 'Weekly'},
    {key: 'monthly', title: 'Monthly'},
  ]);

  useFocusEffect(() => {
    if (profile.unread?.plan) {
      setReadAction('plan');
    }
  });

  const hasClientPremium =
    (profile.premium && profile.premium[CLIENT_PREMIUM]) ||
    profile.admin ||
    isTestFlight();


  return (
    <>
      {plan && hasClientPremium ? (
        <View style={{flex: 1, backgroundColor: colors.appGrey}}>
          <SafeAreaView style={{flex: 1}}>
            <Header showDrawerMenuButton />
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
                          <View
                            style={{
                              height: 40,
                              width: 100,
                              paddingHorizontal: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 12,
                              backgroundColor:
                                props.key === routes[index].key
                                  ? colors.appBlue
                                  : 'transparent',
                              borderWidth:
                                props.key === routes[index].key ? 0 : 1,
                              borderColor: colors.borderColor,
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                              }}>
                              {props.route?.title}
                            </Text>
                          </View>
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
                      marginVertical: 0,
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
        <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
          <Header showDrawerMenuButton />
          <Text
            style={{
              textAlign: 'center',
              margin: 20,
              marginTop: 0,
              fontSize: 25,
              fontWeight: 'bold',
              color: colors.appWhite,
            }}>
            My workout plan
          </Text>

          <View style={{margin: 20, marginTop: 0}}>
            <Text style={{lineHeight: 25, color: '#fff'}}>
              This is your the screen for your personal customized plan, when
              Christian creates your plan it will appear here.{' '}
              {hasClientPremium ? (
                <Text>
                  You're are already subscribed to Client Premium so you just
                  need to wait for Christian to create your plan.
                </Text>
              ) : (
                <Text>
                  To view your plan also make sure you're subscribed to Client
                  Premium.
                </Text>
              )}
            </Text>
            {!hasClientPremium && (
              <Button
                style={{marginTop: 20}}
                text="Get Client Premium"
                onPress={() => navigation.navigate('Premium', {})}
              />
            )}
          </View>
        </SafeAreaView>
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
  getPlan,
  setRead,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
