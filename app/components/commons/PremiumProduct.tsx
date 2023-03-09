import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Purchases, {
  PurchasesEntitlementInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import {logError} from '../../helpers/error';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../constants/colors';
import Snackbar from 'react-native-snackbar';
import {navigationRef} from '../../RootNavigation';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CLIENT_PREMIUM} from '../../constants';

const monthlyPrice = (p: PurchasesPackage) => {
  switch (p.product.identifier) {
    case 'yearly':
    case 'client_yearly':
      return p.product.price / 12;
    default:
      return p.product.price;
  }
};

const getPackageStrings = (p: PurchasesPackage) => {
  switch (p.product.identifier) {
    case 'monthly':
      return {title: 'monthly', alt: 'month'};
    case 'yearly':
      return {title: 'yearly', alt: 'year'};
    case 'client_monthly':
      return {title: 'client monthly', alt: 'month'};
    case 'client_yearly':
      return {title: 'client yearly', alt: 'year'};
  }
};

const isLockedPackage = (p: PurchasesPackage) => {
  const list = ['client_yearly', 'client_monthly'];
  return list.includes(p.product.identifier);
};

const PremiumProduct: React.FC<{
  p: PurchasesPackage;
  setLoading: (loading: boolean) => void;
  setPremiumAction: (
    premium: false | {[key: string]: PurchasesEntitlementInfo},
  ) => void;
  onActivated?: () => void;
  index: number;
  profile: Profile;
}> = ({p, setLoading, setPremiumAction, onActivated, index, profile}) => {
  const packageStrings = getPackageStrings(p);
  const title = packageStrings?.title;
  const locked = isLockedPackage(p) && !profile.client; //&& !profile.admin;
  return (
    <TouchableOpacity
      disabled={locked}
      onPress={async () => {
        try {
          setLoading(true);
          const {customerInfo, productIdentifier} =
            await Purchases.purchasePackage(p);
          if (
            typeof customerInfo.entitlements.active.Premium !== 'undefined' ||
            typeof customerInfo.entitlements.active[CLIENT_PREMIUM] !==
              'undefined'
          ) {
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
      }}
      key={p.identifier}>
      <LinearGradient
        colors={
          index % 2 === 0
            ? [colors.appBlueLight, colors.appBlueDark]
            : [colors.secondaryLight, colors.secondaryDark]
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          height: 100,
          width: 160,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textTransform: 'uppercase',
            textAlign: 'center',
            fontWeight: 'bold',
            color: colors.appWhite,
            fontSize: 18,
          }}>
          {title}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            color: colors.appWhite,
            fontSize: 14,
          }}>
          {p.product.priceString}
        </Text>
        {locked && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="lock" size={30} color={colors.appWhite} />
          </View>
        )}
      </LinearGradient>
      <View
        style={{
          position: 'absolute',
          right: 0,
          left: 0,
          top: -10,
        }}>
        <View
          style={{
            height: 35,
            borderRadius: 20,
            backgroundColor: colors.appWhite,
            width: 115,
            alignSelf: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: index % 2 === 0 ? colors.appBlue : colors.secondaryDark,
              fontSize: 16,
            }}>{`${p.product.priceString[0]}${monthlyPrice(p).toFixed(
            2,
          )}/mo`}</Text>
          {locked && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(PremiumProduct);
