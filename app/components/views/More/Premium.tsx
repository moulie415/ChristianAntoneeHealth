import {Layout, Button} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
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
          setPackages(offerings.current.availablePackages);
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
    <Layout level="4" style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{flex: 1}}>
        <Image
          style={{
            alignSelf: 'center',
            height: DevicePixels[50],
            width: '100%',
            margin: DevicePixels[20],
            marginBottom: DevicePixels[10],
          }}
          resizeMode="contain"
          source={require('../../../images/logo.png')}
        />
        <Text
          category="h5"
          style={{
            marginBottom: DevicePixels[20],
            textAlign: 'center',
          }}>
          Go Premium!
        </Text>
        <View
          style={{
            marginHorizontal: DevicePixels[20],
            marginBottom: DevicePixels[20],
          }}>
          <View style={{flexDirection: 'row', marginBottom: DevicePixels[20]}}>
            <Icon
              style={{width: DevicePixels[75], textAlign: 'center'}}
              size={DevicePixels[30]}
              color={colors.appBlue}
              name="dumbbell"
            />
            <View style={{flex: 1}}>
              <Text category="s1" style={{fontWeight: 'bold'}}>
                Workouts
              </Text>
              <Text style={{}}>
                Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> workouts to
                select workouts from any training style and target every body
                part
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: DevicePixels[20]}}>
            <Icon
              style={{width: DevicePixels[75], textAlign: 'center'}}
              size={DevicePixels[30]}
              color={colors.appBlue}
              name="book-open"
            />
            <View style={{flex: 1}}>
              <Text category="s1" style={{fontWeight: 'bold'}}>
                Educational Articles
              </Text>
              <Text style={{}}>
                Gain access to <Text style={{fontWeight: 'bold'}}>ALL</Text>{' '}
                educational content
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: DevicePixels[20]}}>
            <Icon
              style={{width: DevicePixels[75], textAlign: 'center'}}
              size={DevicePixels[30]}
              color={colors.appBlue}
              name="heartbeat"
            />
            <View style={{flex: 1}}>
              <Text category="s1" style={{fontWeight: 'bold'}}>
                Fitness Testing
              </Text>
              <Text style={{}}>
                See how you rank against others by unlocking{' '}
                <Text style={{fontWeight: 'bold'}}>ALL</Text> fitness testing
                categories
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: DevicePixels[20]}}>
            <Icon
              style={{width: DevicePixels[75], textAlign: 'center'}}
              size={DevicePixels[30]}
              color={colors.appBlue}
              name="user-friends"
            />
            <View style={{flex: 1}}>
              <Text category="s1" style={{fontWeight: 'bold'}}>
                Stay connected
              </Text>
              <Text style={{}}>
                Enjoy in-app messaging where you can share exercises, workouts,
                and compare tests results!
              </Text>
            </View>
          </View>
          {settings.ads && (
            <View
              style={{flexDirection: 'row', marginBottom: DevicePixels[20]}}>
              <Icon
                style={{width: DevicePixels[75], textAlign: 'center'}}
                size={DevicePixels[30]}
                color={colors.appBlue}
                name="comment-slash"
              />
              <View style={{flex: 1}}>
                <Text category="s1" style={{fontWeight: 'bold'}}>
                  Remove Ads
                </Text>
                <Text style={{}}>
                  Enjoy the full content of the app Ad-free
                </Text>
              </View>
            </View>
          )}
        </View>
        {packages.length ? (
          <>
            {premiumActive ? (
              <View
                style={{alignItems: 'center', paddingBottom: DevicePixels[20]}}>
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  {packages.map(p => {
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
                              Snackbar.show({text: 'Premium activated'});
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
                        style={{
                          borderColor: colors.appBlue,
                          borderWidth: DevicePixels[3],
                          height: DevicePixels[100],
                          width: DevicePixels[125],
                          borderRadius: DevicePixels[10],
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        key={p.identifier}>
                        <Text
                          category="h6"
                          style={{
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}>
                          {title}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: colors.appBlue,
                            fontWeight: 'bold',
                          }}>
                          {p.product.price_string}
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.appBlue,
                            padding: DevicePixels[1],
                            paddingHorizontal: DevicePixels[4],
                            borderRadius: DevicePixels[5],
                            marginTop: DevicePixels[2],
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: colors.appWhite,
                            }}>{`${monthlyPrice(p).toFixed(2)}/mo`}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  onPress={async () => {
                    setLoading(true);
                    const restore = await Purchases.restoreTransactions();
                    if (
                      typeof restore.entitlements.active.Premium !== 'undefined'
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
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: DevicePixels[10],
                      marginBottom: DevicePixels[20],
                      padding: DevicePixels[10],
                      color: colors.appBlue,
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
      </ScrollView>
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};
const mapStateToProps = ({settings}: MyRootState) => ({
  settings,
});

const mapDispatchToProps = {
  setPremiumAction: setPremium,
};

export default connect(mapStateToProps, mapDispatchToProps)(Premium);
