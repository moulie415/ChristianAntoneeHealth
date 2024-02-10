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
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Purchases, {
  CustomerInfo,
  PurchasesEntitlementInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import {navigationRef} from '../../../RootNavigation';
import colors from '../../../constants/colors';
import {logError} from '../../../helpers/error';
import {setPremium} from '../../../reducers/profile';
import {SettingsState} from '../../../reducers/settings';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import PremiumProduct from '../../commons/PremiumProduct';
import Text from '../../commons/Text';

const {height} = Dimensions.get('window');

const MIN_CONTENT_HEIGHT = 620;

const CONTENT_HEIGHT =
  height * 0.7 > MIN_CONTENT_HEIGHT || MIN_CONTENT_HEIGHT > height
    ? height * 0.7
    : MIN_CONTENT_HEIGHT;

const Premium: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Premium'>;
  setPremiumAction: (
    premium: false | {[key: string]: PurchasesEntitlementInfo},
  ) => void;
  settings: SettingsState;
  route: RouteProp<StackParamList, 'Premium'>;
  profile: Profile;
}> = ({navigation, setPremiumAction, settings, route, profile}) => {
  const [selected, setSelected] = useState('');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [info, setInfo] = useState<CustomerInfo>();
  const [loading, setLoading] = useState(false);
  const onActivated = route.params?.onActivated;
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
          // offerings.current.availablePackages.forEach(pkg => {
          //   console.log(pkg.product.productCategory);
          // });
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        // @ts-ignore
        Alert.alert('Error fetching Premium offerings', e.message);
        logError(e);
      }
    };
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
        const {customerInfo, productIdentifier} =
          await Purchases.purchasePackage(p);
        if (typeof customerInfo.entitlements.active.Premium !== 'undefined') {
          setLoading(false);
          navigationRef.goBack();
          setPremiumAction(customerInfo.entitlements.active);
          Snackbar.show({text: 'Premium activated!'});
          if (onActivated) {
            onActivated();
          }
        }
      } catch (e) {
        setLoading(false);
        // @ts-ignore
        if (!e.userCancelled) {
          logError(e);
          // @ts-ignore
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
  ];

  const premiumActive = info && info.activeSubscriptions[0];

  const premiumPlusActive =
    premiumActive === 'monthly:monthly-plus' ||
    premiumActive === 'monthly_plus';
  const hasUsedTrial = info && info.entitlements.all[0];

  return (
    <>
      <FastImage
        source={require('../../../images/Equipment-minimal.jpeg')}
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
              return (
                <View
                  key={icon}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <Icon
                      style={{width: 40}}
                      size={20}
                      color={colors.appWhite}
                      name={icon}
                      solid={solid}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.appWhite,
                      flex: 1,
                    }}>
                    {feature}
                  </Text>
                  <Icon
                    style={{width: 40, fontWeight: 'bold'}}
                    size={25}
                    solid
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
                <>
                  {packages.map(item => {
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
                    style={{margin: 20, marginBottom: 10}}
                  />
                </>
              )}

              <TouchableOpacity
                onPress={async () => {
                  try {
                    setLoading(true);
                    const restore = await Purchases.restorePurchases();
                    if (
                      typeof restore.entitlements.active.Premium !== 'undefined'
                    ) {
                      setLoading(false);
                      navigation.goBack();
                      setPremiumAction(restore.entitlements.active);
                      Snackbar.show({text: 'Premium re-activated'});
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
const mapStateToProps = ({settings, profile}: MyRootState) => ({
  settings,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setPremiumAction: setPremium,
};

export default connect(mapStateToProps, mapDispatchToProps)(Premium);
