import {Layout, Text, Button} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import crashlytics from '@react-native-firebase/crashlytics';
import Purchases, {
  PurchaserInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import Image from 'react-native-fast-image';
import PremiumProps from '../../types/views/Premium';
import colors from '../../constants/colors';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {setPremium} from '../../actions/profile';
import {connect} from 'react-redux';
import Snackbar from 'react-native-snackbar';

const Premium: React.FC<PremiumProps> = ({navigation, setPremiumAction}) => {
  const [pkg, setPackage] = useState<PurchasesPackage>();
  const [info, setInfo] = useState<PurchaserInfo>();
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
          setPackage(offerings.current.availablePackages[0]);
        }
      } catch (e) {
        Alert.alert('Error fetching Premium offerings', e.message);
        crashlytics().recordError(e);
      }
    };
    getOfferings();
  }, []);
  const premiumActive = info && info.activeSubscriptions[0];
  const hasUsedTrial = info && info.entitlements.all[0];
  return (
    <Layout level="4" style={{flex: 1}}>
      <Text category="h3" style={{margin: 40}}>
        Health and Movement Premium
      </Text>
      <View style={{marginHorizontal: 40, marginBottom: 40}}>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Icon
            style={{width: 75, textAlign: 'center'}}
            size={30}
            color={colors.appBlue}
            name="dumbbell"
          />
          <View style={{flex: 1}}>
            <Text category="s1">Workouts</Text>
            <Text>
              Access to an extensive library of customisable exercises allowing
              you to build your own workout routines
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Icon
            style={{width: 75, textAlign: 'center'}}
            size={30}
            color={colors.appBlue}
            name="heartbeat"
          />
          <View style={{flex: 1}}>
            <Text category="s1">Fitness tests</Text>
            <Text>Measure your progress through a range of fitness tests</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <View style={{width: 75, alignItems: 'center'}}>
            <Image
              style={{width: 40, height: 40}}
              source={
                Platform.OS === 'ios'
                  ? require('../../images/apple_health.png')
                  : require('../../images/fit.png')
              }
            />
          </View>
          <View style={{flex: 1}}>
            <Text category="s1">
              {Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'}
            </Text>
            <Text>{`Track your activity by connecting with ${
              Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
            }`}</Text>
          </View>
        </View>
      </View>
      {pkg ? (
        <>
          {premiumActive ? (
            <View style={{alignItems: 'center'}}>
              <Text category="h3" style={{textAlign: 'center'}}>
                🎉 Premium active 🎉
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(info.managementURL)}>
                <Text
                  category="s1"
                  style={{textAlign: 'center'}}
                  status="primary">
                  Manage subscription
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Button
                style={{marginHorizontal: 40, marginBottom: 5}}
                onPress={async () => {
                  try {
                    const {
                      purchaserInfo,
                      productIdentifier,
                    } = await Purchases.purchasePackage(pkg);
                    if (
                      typeof purchaserInfo.entitlements.active.Premium !==
                      'undefined'
                    ) {
                      navigation.goBack();
                      setPremiumAction(true);
                      Snackbar.show({text: 'Premium activated'});
                    }
                  } catch (e) {
                    if (!e.userCancelled) {
                      crashlytics().recordError(e);
                      Alert.alert('Error', e.message);
                    }
                  }
                }}>
                {hasUsedTrial
                  ? `${pkg.product.price_string}/month`
                  : 'Start a 1-Week free trial'}
              </Button>

              {!hasUsedTrial && (
                <Text
                  style={{
                    textAlign: 'center',
                  }}>{`${pkg.product.price_string}/month after`}</Text>
              )}
            </>
          )}
        </>
      ) : (
        <ActivityIndicator />
      )}
    </Layout>
  );
};

const mapDispatchToProps = {
  setPremiumAction: setPremium,
};

export default connect(null, mapDispatchToProps)(Premium);
