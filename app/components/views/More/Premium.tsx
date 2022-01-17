import {Layout, Text, Button} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import crashlytics from '@react-native-firebase/crashlytics';
import Purchases, {
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

const Premium: React.FC<PremiumProps> = ({
  navigation,
  setPremiumAction,
  settings,
}) => {
  const [pkg, setPackage] = useState<PurchasesPackage>();
  const [info, setInfo] = useState<PurchaserInfo>();
  const [loading, setLoading] = useState(false);
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
          source={require('../../../images/health_and_movement_logo_colour_centred.png')}
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
                Exercise Video Library
              </Text>
              <Text style={{}}>
                Customise your workouts with full access to{' '}
                <Text style={{fontWeight: 'bold'}}>ALL</Text> exercise videos
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: DevicePixels[20]}}>
            <Icon
              style={{width: DevicePixels[75], textAlign: 'center'}}
              size={DevicePixels[30]}
              color={colors.appBlue}
              name="list-ol"
            />
            <View style={{flex: 1}}>
              <Text category="s1" style={{fontWeight: 'bold'}}>
                Quick Routines
              </Text>
              <Text style={{}}>
                Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> quick
                routines to select workouts from any training style and target
                every body part
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
                  style={{
                    marginHorizontal: DevicePixels[40],
                    marginBottom: DevicePixels[5],
                  }}
                  onPress={async () => {
                    try {
                      setLoading(true);
                      const {
                        purchaserInfo,
                        productIdentifier,
                      } = await Purchases.purchasePackage(pkg);
                      if (
                        typeof purchaserInfo.entitlements.active.Premium !==
                        'undefined'
                      ) {
                        setLoading(false);
                        navigation.goBack();
                        setPremiumAction(true);
                        Snackbar.show({text: 'Premium activated'});
                      }
                    } catch (e) {
                      setLoading(false);
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
                      paddingBottom: DevicePixels[20],
                      textAlign: 'center',
                    }}>{`${pkg.product.price_string}/month after`}</Text>
                )}
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
