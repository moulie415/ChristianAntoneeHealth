import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Purchases, {
  PACKAGE_TYPE,
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import PremiumProps from '../../../types/views/Premium';
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

const Premium: React.FC<PremiumProps> = ({
  navigation,
  setPremiumAction,
  settings,
  route,
}) => {
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
          setPackages(
            offerings.current.availablePackages.filter(
              p => p.packageType !== 'CUSTOM',
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

  const getPackageStrings = (p: PurchasesPackage) => {
    switch (p.packageType) {
      case PACKAGE_TYPE.MONTHLY:
        return {title: 'monthly', alt: 'month'};
      case PACKAGE_TYPE.ANNUAL:
        return {title: 'yearly', alt: 'year'};
    }
  };

  const monthlyPrice = (p: PurchasesPackage) => {
    switch (p.packageType) {
      case PACKAGE_TYPE.ANNUAL:
        return p.product.price / 12;
      default:
        return p.product.price;
    }
  };

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
                <Icon
                  style={{marginRight: 10}}
                  size={20}
                  color={colors.appWhite}
                  name="dumbbell"
                />
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
                <Icon
                  style={{marginRight: 10}}
                  size={20}
                  color={colors.appWhite}
                  name="book-open"
                />
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
                <Icon
                  style={{marginRight: 10}}
                  size={20}
                  color={colors.appWhite}
                  name="heartbeat"
                />
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
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <Icon
                  style={{marginRight: 10}}
                  size={20}
                  color={colors.appWhite}
                  name="user-friends"
                />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: colors.appWhite,
                    }}>
                    One-to-One Communication
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.appWhite,
                    }}>
                    Ask questions and discuss health and fitness topics directly
                    with Christian using our in-app messaging
                  </Text>
                </View>
              </View>
              {settings.plansEnabled && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                  }}>
                  <Icon
                    style={{marginRight: 10}}
                    size={20}
                    color={colors.appWhite}
                    name="calendar-alt"
                  />

                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: colors.appWhite,
                        fontSize: 18,
                      }}>
                      Customized plans
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.appWhite,
                      }}>
                      Purchase customized monthly plans tailored specifically to
                      you. Get your first plan{' '}
                      <Text style={{fontWeight: 'bold'}}>FREE</Text> with
                      premium!
                    </Text>
                  </View>
                </View>
              )}
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
              {premiumActive ? (
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
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    {packages.map((p, index) => {
                      const packageStrings = getPackageStrings(p);
                      const title = packageStrings?.title;
                      return (
                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              setLoading(true);
                              const {customerInfo, productIdentifier} =
                                await Purchases.purchasePackage(p);
                              if (
                                typeof customerInfo.entitlements.active
                                  .Premium !== 'undefined'
                              ) {
                                setLoading(false);
                                navigation.goBack();
                                setPremiumAction(true);
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
                              index === 0
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
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color:
                                    index === 0
                                      ? colors.appBlue
                                      : colors.secondaryDark,
                                  fontSize: 16,
                                }}>{`${p.product.priceString[0]}${monthlyPrice(
                                p,
                              ).toFixed(2)}/mo`}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        setLoading(true);
                        const restore = await Purchases.restorePurchases();
                        if (
                          typeof restore.entitlements.active.Premium !==
                          'undefined'
                        ) {
                          setLoading(false);
                          navigation.goBack();
                          setPremiumAction(true);
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

                  {/* {!hasUsedTrial && (
                  <Text
                    style={{
                      paddingBottom: 20,
                      textAlign: 'center',
                    }}>{`${pkg.product.price_string}/month after`}</Text>
                )} */}
                </>
              )}
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
const mapStateToProps = ({settings}: MyRootState) => ({
  settings,
});

const mapDispatchToProps = {
  setPremiumAction: setPremium,
};

export default connect(mapStateToProps, mapDispatchToProps)(Premium);
