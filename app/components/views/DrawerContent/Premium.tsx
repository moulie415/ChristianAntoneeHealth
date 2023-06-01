import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Purchases, {
  PACKAGE_TYPE,
  CustomerInfo,
  PurchasesPackage,
  PurchasesEntitlementInfo,
} from 'react-native-purchases';
import colors from '../../../constants/colors';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {setPremium} from '../../../actions/profile';
import {connect} from 'react-redux';
import Snackbar from 'react-native-snackbar';

import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {logError} from '../../../helpers/error';
import Text from '../../commons/Text';
import Header from '../../commons/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native';
import PremiumProduct from '../../commons/PremiumProduct';
import {SettingsState} from '../../../reducers/settings';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {CLIENT_PREMIUM} from '../../../constants';
import Profile from '../../../types/Profile';

const Premium: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Premium'>;
  setPremiumAction: (
    premium: false | {[key: string]: PurchasesEntitlementInfo},
  ) => void;
  settings: SettingsState;
  route: RouteProp<StackParamList, 'Premium'>;
  profile: Profile;
}> = ({navigation, setPremiumAction, settings, route, profile}) => {
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
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => navigation.goBack()}>
            <Text style={{color: colors.appBlue}}>Cancel</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  const premiumActive = info && info.activeSubscriptions[0];
  const hasUsedTrial = info && info.entitlements.all[0];
  return (
    <FastImage
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={{
              marginHorizontal: 10,
              borderRadius: 20,
              marginBottom: 20,
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}>
            <View
              style={{
                margin: 20,
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                  marginBottom: 10,
                }}>
                PREMIUM
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <View style={{justifyContent: 'center'}}>
                  <Icon
                    style={{marginRight: 10}}
                    size={20}
                    color={colors.appWhite}
                    name="dumbbell"
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: colors.appWhite,
                    }}>
                    Workouts
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.appWhite,
                    }}>
                    Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text>{' '}
                    workouts to select workouts from any training style and
                    target every body part
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <View style={{justifyContent: 'center'}}>
                  <Icon
                    style={{marginRight: 10}}
                    size={20}
                    color={colors.appWhite}
                    name="book-open"
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: colors.appWhite,
                    }}>
                    Educational Articles
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.appWhite,
                    }}>
                    Gain access to <Text style={{fontWeight: 'bold'}}>ALL</Text>{' '}
                    educational content
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <View style={{justifyContent: 'center'}}>
                  <Icon
                    style={{marginRight: 10}}
                    size={20}
                    color={colors.appWhite}
                    name="heartbeat"
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: colors.appWhite,
                    }}>
                    Fitness Testing
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.appWhite,
                    }}>
                    See how you rank against others by unlocking{' '}
                    <Text style={{fontWeight: 'bold'}}>ALL</Text> fitness
                    testing categories
                  </Text>
                </View>
              </View>

              {settings.ads && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                  }}>
                  <Icon
                    style={{marginRight: 10}}
                    size={20}
                    color={colors.appWhite}
                    name="comment-slash"
                  />
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: colors.appWhite,
                        fontSize: 18,
                      }}>
                      Remove Ads
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.appWhite,
                      }}>
                      Enjoy the full content of the app Ad-free
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          {packages.length ? (
            <>
              {premiumActive && (
                <View
                  style={{
                    alignItems: 'center',
                    paddingBottom: 20,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.appWhite,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    🎉 Premium active 🎉
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
              )}
              <>
                <FlatList
                  data={packages}
                  numColumns={2}
                  contentContainerStyle={{minHeight: 200}}
                  ListFooterComponent={
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          setLoading(true);
                          const restore = await Purchases.restorePurchases();
                          if (
                            typeof restore.entitlements.active.Premium !==
                              'undefined' ||
                            typeof restore.entitlements.active[
                              CLIENT_PREMIUM
                            ] !== 'undefined'
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
                          marginTop: 10,
                          marginBottom: 20,
                          padding: 10,
                          color: colors.appWhite,
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}>
                        Restore purchases
                      </Text>
                    </TouchableOpacity>
                  }
                  columnWrapperStyle={{
                    justifyContent: 'space-evenly',
                    paddingTop: 25,
                  }}
                  keyExtractor={item => item.identifier}
                  renderItem={({item, index}) => {
                    if (
                      (profile.client && item.packageType === 'CUSTOM') ||
                      (!profile.client && item.packageType !== 'CUSTOM')
                    ) {
                      return (
                        <PremiumProduct
                          p={item}
                          onActivated={onActivated}
                          setLoading={setLoading}
                          index={index}
                          setPremiumAction={setPremiumAction}
                        />
                      );
                    }
                    return null;
                  }}
                />

                {/* {!hasUsedTrial && (
                  <Text
                    style={{
                      paddingBottom: 20,
                      textAlign: 'center',
                    }}>{`${pkg.product.price_string}/month after`}</Text>
                )} */}
              </>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <AbsoluteSpinner loading={loading} />
      </SafeAreaView>
    </FastImage>
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
