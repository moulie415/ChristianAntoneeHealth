import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {logError} from '../../../helpers/error';
import {hasPremiumPlus} from '../../../helpers/hasPremiumPlus';
import {getPlan, setRead} from '../../../reducers/profile';
import {Plan as PlanType, Profile} from '../../../types/Shared';
import Header from '../../commons/Header';
import Text from '../../commons/Text';
import Daily from './Daily';
import Monthly from './Monthly';
import Weekly from './Weekly';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        if (e instanceof Error) {
          Alert.alert('Error fetching Premium offerings', e.message);
        }
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

  const hasPremium = profile.admin || hasPremiumPlus(profile.premium);

  return (
    <>
      {plan && hasPremium ? (
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
                    // labelStyle={{
                    //   textTransform: 'none',
                    //   color: colors.appBlack,
                    // }}
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
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -100,
            }}>
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: colors.borderColor,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome6
                style={{position: 'absolute'}}
                name="calendar-days"
                color={colors.appBlue}
                size={50}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                margin: 20,
                fontSize: 25,
                fontWeight: 'bold',
                color: colors.appWhite,
              }}>
              My workout plan
            </Text>

            <View style={{marginHorizontal: 20, width: 275}}>
              <Text
                style={{
                  color: colors.offWhite,
                  fontSize: 12,
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                This is your the screen for your personal customized plan, when
                Christian creates your plan it will appear here.{' '}
                {hasPremium ? (
                  <Text>
                    You're are already subscribed to Premium Plus so you just
                    need to wait for Christian to create your plan.
                  </Text>
                ) : (
                  <Text>
                    To view your plan also make sure you're subscribed to
                    Premium.
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
  loading: profile.loading,
  plan: profile.plan,
});

const mapDispatchToProps = {
  getPlan,
  setRead,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
