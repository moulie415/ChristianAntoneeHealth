import {Layout, Text, Button} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Purchases from 'react-native-purchases';
import Image from 'react-native-fast-image';
import PremiumProps from '../../types/views/Premium';
import colors from '../../constants/colors';
import {Platform, View} from 'react-native';

const Premium: React.FC<PremiumProps> = () => {
  useEffect(() => {
    const getOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        console.log(offerings);
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          console.log(offerings.current);
          // Display packages for sale
        }
      } catch (e) {
        console.log(e);
      }
    };
    getOfferings();
  }, []);
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
      <Button style={{marginHorizontal: 40, marginBottom: 5}}>
        Start a 1-Week free trial
      </Button>

      <Text style={{textAlign: 'center'}}>£9.99/month after</Text>
    </Layout>
  );
};

export default Premium;
