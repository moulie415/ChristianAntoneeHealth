import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {ReactNode, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import Snackbar from 'react-native-snackbar';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {logError} from '../../../helpers/error';
import {PREMIUM_PLUS, hasPremiumPlus} from '../../../helpers/hasPremiumPlus';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {setPremium} from '../../../reducers/profile';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import PremiumProduct from '../../commons/PremiumProduct';
import Text from '../../commons/Text';

const {height} = Dimensions.get('window');

const MIN_CONTENT_HEIGHT = 670;

const Premium: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Premium'>;
  route: RouteProp<StackParamList, 'Premium'>;
}> = ({navigation, route}) => {
  const [selected, setSelected] = useState('');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [info, setInfo] = useState<CustomerInfo>();
  const [loading, setLoading] = useState(false);
  const onActivated = route.params?.onActivated;

  const dispatch = useAppDispatch();

  const {profile} = useAppSelector(state => state.profile);

  const showPremiumPlus = profile.client || profile.admin;

  const CONTENT_HEIGHT =
    (height * 0.7 > MIN_CONTENT_HEIGHT || MIN_CONTENT_HEIGHT > height
      ? height * 0.7
      : MIN_CONTENT_HEIGHT) + (showPremiumPlus ? 50 : 0);

  const getOfferings = async () => {
    try {
      const purchaserInfo = await Purchases.getCustomerInfo();
      setInfo(purchaserInfo);
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert('Error fetching Premium offerings', e.message);
      }
      logError(e);
    }
  };

  useEffect(() => {
    getOfferings();
  }, []);

  useEffect(() => {
    if (packages && packages.length) {
      const initialSelected = packages[0]?.identifier;
      if (initialSelected) {
        setSelected(initialSelected);
      }
    }
  }, [packages]);

  const onPurchase = async (p?: PurchasesPackage) => {
    if (p) {
      try {
        setLoading(true);
        // if (premiumPlusStrings.includes(p.identifier)) {

        // }
        const {customerInfo, productIdentifier} =
          await Purchases.purchasePackage(p);
        if (
          typeof customerInfo.entitlements.active.Premium !== 'undefined' ||
          typeof customerInfo.entitlements.active[PREMIUM_PLUS] !== 'undefined'
        ) {
          await getOfferings();

          setLoading(false);
          navigation.navigate('PremiumPurchased', {});

          dispatch(setPremium(customerInfo.entitlements.active));

          if (onActivated) {
            onActivated();
          }
        }
      } catch (e: any) {
        setLoading(false);
        if (!e.userCancelled) {
          logError(e);
          Alert.alert('Error', e.message);
        }
      }
    }
  };

  const premiumPlusStrings = ['monthly_plus'];

  const features: {
    icon: string;
    feature: ReactNode | string;
    available: boolean;
    solid?: boolean;
  }[] = [
    {
      icon: 'dumbbell',
      feature: (
        <>
          Unlock <Text style={{fontWeight: 'bold'}}>ALL </Text>
          workouts & fitness tests
        </>
      ),
      available: true,
    },
    {
      icon: 'book-open',
      feature: (
        <>
          Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> educational
          content
        </>
      ),
      available: true,
    },
    {
      icon: 'utensils',
      feature: (
        <>
          Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> recipes
        </>
      ),
      available: true,
    },

    {
      icon: 'heart',
      feature: (
        <>
          Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> biometric
          tracking
        </>
      ),
      available: true,
    },
    {
      icon: 'trophy',
      feature: 'Compete in leaderboards',
      available: true,
    },
    {
      icon: 'calendar-alt',
      feature: 'Request custom workouts from Christian',
      available: premiumPlusStrings.includes(selected),
    },
    {
      icon: 'comment',
      feature: 'In-app real time trainer-to-client messaging',
      available: premiumPlusStrings.includes(selected),
      solid: true,
    },

    {
      icon: 'chart-column',
      feature: 'Weekly check-ins to keep you on track',
      available: premiumPlusStrings.includes(selected),
    },
  ];

  const premiumActive = info && info.activeSubscriptions[0];

  const premiumPlusActive = hasPremiumPlus(profile.premium);
  const hasUsedTrial = info && info.entitlements.all[0];

  return (
    <>
      <FastImage
        source={require('../../../images/premium-paywall.jpeg')}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          height: '50%',
          left: 0,
          right: -200,
        }}
      />

      <Header hasBack absolute />
      <LinearGradient
        colors={['rgba(54, 57, 68,0)', colors.appGrey]}
        style={{
          position: 'absolute',
          right: 0,
          bottom: CONTENT_HEIGHT,
          left: 0,
          height: 200,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          height: CONTENT_HEIGHT,
          backgroundColor: colors.appGrey,
        }}>
        <ScrollView>
          <Text
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
              fontSize: 30,
              color: colors.appWhite,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            FIT FOR LIFE!
          </Text>
          <View
            style={{
              marginLeft: 20,

              marginTop: 20,
            }}>
            {features.map(({feature, icon, available, solid}) => {
              if (!showPremiumPlus && !available) {
                return null;
              }
              return (
                <View
                  key={icon}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                  {/* <View style={{justifyContent: 'center'}}>
                    <Icon
                      style={{width: 40}}
                      size={20}
                      color={colors.appWhite}
                      name={icon}
                      solid={solid}
                    />
                  </View> */}
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.appWhite,
                      flex: 1,
                    }}>
                    {feature}
                  </Text>
                  <FontAwesome6
                    style={{width: 40, fontWeight: 'bold'}}
                    size={25}
                    iconStyle="solid"
                    color={
                      available || premiumPlusActive
                        ? colors.appGreen
                        : colors.appRed
                    }
                    name={available || premiumPlusActive ? 'check' : 'xmark'}
                  />
                </View>
              );
            })}
          </View>
          {packages.length ? (
            <>
              {premiumActive ? (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: 40,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.appWhite,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    {`🎉  Premium ${
                      premiumPlusActive ? 'Plus' : ''
                    } active  🎉`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(info.managementURL || '')}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.appWhite,
                        textDecorationLine: 'underline',
                      }}>
                      Manage subscription
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {packages.map(item => {
                    const show =
                      !premiumPlusStrings.includes(item.identifier) ||
                      showPremiumPlus;
                    if (!show) {
                      return null;
                    }
                    return (
                      <PremiumProduct
                        p={item}
                        key={item.identifier}
                        selected={selected === item.identifier}
                        setSelected={setSelected}
                      />
                    );
                  })}

                  <Button
                    text="subscribe"
                    onPress={() =>
                      onPurchase(packages.find(p => p.identifier === selected))
                    }
                    disabled={!selected}
                    style={{margin: 20, marginBottom: 0}}
                  />
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  margin: 20,
                }}>
                <Button
                  variant="secondary"
                  text="Terms of Service"
                  onPress={() =>
                    navigation.navigate('WebViewScreen', {
                      uri: Config.TERMS_AND_CONDITIONS as string,
                      title: 'Terms of Service',
                    })
                  }
                  style={{flex: 1, marginRight: 5}}
                />

                <Button
                  variant="secondary"
                  text="Privacy Policy"
                  onPress={() =>
                    navigation.navigate('WebViewScreen', {
                      uri: Config.PRIVACY_POLICY as string,
                      title: 'Privacy Policy',
                    })
                  }
                  style={{flex: 1, marginLeft: 5}}
                />
              </View>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    setLoading(true);
                    const restore = await Purchases.restorePurchases();
                    if (
                      typeof restore.entitlements.active.Premium !==
                        'undefined' ||
                      typeof restore.entitlements.active[PREMIUM_PLUS] !==
                        'undefined'
                    ) {
                      await getOfferings();
                      setLoading(false);
                      dispatch(setPremium(restore.entitlements.active));
                      navigation.navigate('PremiumPurchased', {restored: true});
                    } else {
                      setLoading(false);
                      Snackbar.show({
                        text: 'No previous active subscription found',
                      });
                    }
                  } catch (e) {
                    logError(e);
                    setLoading(false);
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                    padding: 10,
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  Restore purchases
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </ScrollView>
      </View>

      <AbsoluteSpinner loading={loading} />
    </>
  );
};

export default Premium;
