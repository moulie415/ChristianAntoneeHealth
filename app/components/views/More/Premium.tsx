import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Purchases, {
  PACKAGE_TYPE,
  PurchaserInfo,
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
import DevicePixels from '../../../helpers/DevicePixels';
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
  const [info, setInfo] = useState<PurchaserInfo>();
  const [loading, setLoading] = useState(false);
  const onActivated = route.params?.onActivated;
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
              p => p.packageType !== 'CUSTOM',
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
            style={{padding: DevicePixels[10]}}
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
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View
            style={{
              marginHorizontal: DevicePixels[10],
              borderRadius: DevicePixels[20],
              marginBottom: DevicePixels[20],
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}>
            <View
              style={{
                margin: DevicePixels[20],
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: DevicePixels[25],
                  marginBottom: DevicePixels[10],
                }}>
                PREMIUM
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: DevicePixels[20],
                }}>
                <Icon
                  style={{marginRight: DevicePixels[10]}}
                  size={DevicePixels[20]}
                  color={colors.appWhite}
                  name="dumbbell"
                />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: DevicePixels[18],
                      color: colors.appWhite,
                    }}>
                    Workouts
                  </Text>
                  <Text
                    style={{
                      fontSize: DevicePixels[10],
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
                  marginBottom: DevicePixels[20],
                }}>
                <Icon
                  style={{marginRight: DevicePixels[10]}}
                  size={DevicePixels[20]}
                  color={colors.appWhite}
                  name="book-open"
                />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: DevicePixels[18],
                      color: colors.appWhite,
                    }}>
                    Educational Articles
                  </Text>
                  <Text
                    style={{
                      fontSize: DevicePixels[10],
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
                  marginBottom: DevicePixels[20],
                }}>
                <Icon
                  style={{marginRight: DevicePixels[10]}}
                  size={DevicePixels[20]}
                  color={colors.appWhite}
                  name="heartbeat"
                />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: DevicePixels[18],
                      color: colors.appWhite,
                    }}>
                    Fitness Testing
                  </Text>
                  <Text
                    style={{
                      fontSize: DevicePixels[10],
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
                  marginBottom: DevicePixels[20],
                }}>
                <Icon
                  style={{marginRight: DevicePixels[10]}}
                  size={DevicePixels[20]}
                  color={colors.appWhite}
                  name="user-friends"
                />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: DevicePixels[18],
                      color: colors.appWhite,
                    }}>
                    Stay connected
                  </Text>
                  <Text
                    style={{
                      fontSize: DevicePixels[10],
                      color: colors.appWhite,
                    }}>
                    Enjoy in-app messaging where you can share exercises,
                    workouts, and compare tests results!
                  </Text>
                </View>
              </View>
              {settings.plansEnabled && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: DevicePixels[20],
                  }}>
                  <Icon
                    style={{marginRight: DevicePixels[10]}}
                    size={DevicePixels[20]}
                    color={colors.appWhite}
                    name="calendar-alt"
                  />
                  &
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: colors.appWhite,
                        fontSize: DevicePixels[18],
                      }}>
                      Customized plans
                    </Text>
                    <Text
                      style={{
                        fontSize: DevicePixels[10],
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
                    marginBottom: DevicePixels[20],
                  }}>
                  <Icon
                    style={{width: DevicePixels[75], textAlign: 'center'}}
                    size={DevicePixels[20]}
                    color={colors.appBlue}
                    name="comment-slash"
                  />
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>Remove Ads</Text>
                    <Text style={{}}>
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
                    paddingBottom: DevicePixels[20],
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.appWhite,
                      fontWeight: 'bold',
                      fontSize: DevicePixels[20],
                    }}>
                    🎉 Premium active 🎉
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(info.managementURL)}>
                    <Text style={{textAlign: 'center'}}>
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
                      const {title, alt} = getPackageStrings(p);
                      return (
                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              setLoading(true);
                              const {purchaserInfo, productIdentifier} =
                                await Purchases.purchasePackage(p);
                              if (
                                typeof purchaserInfo.entitlements.active
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
                              if (!e.userCancelled) {
                                logError(e);
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
                              height: DevicePixels[100],
                              width: DevicePixels[160],
                              borderRadius: DevicePixels[10],
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: colors.appWhite,
                                fontSize: DevicePixels[18],
                              }}>
                              {title}
                            </Text>

                            <Text
                              style={{
                                textAlign: 'center',
                                color: colors.appWhite,
                                fontSize: DevicePixels[14],
                              }}>
                              {p.product.price_string}
                            </Text>
                          </LinearGradient>
                          <View
                            style={{
                              position: 'absolute',
                              right: 0,
                              left: 0,
                              top: -DevicePixels[10],
                            }}>
                            <View
                              style={{
                                height: DevicePixels[35],
                                borderRadius: DevicePixels[20],
                                backgroundColor: colors.appWhite,
                                width: DevicePixels[115],
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
                                  fontSize: DevicePixels[16],
                                }}>{`${p.product.price_string[0]}${monthlyPrice(
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
                        const restore = await Purchases.restoreTransactions();
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
                        marginTop: DevicePixels[10],
                        marginBottom: DevicePixels[20],
                        padding: DevicePixels[10],
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
                      paddingBottom: DevicePixels[20],
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
