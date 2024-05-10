import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import {FONTS_SIZES} from '../../../constants';
import colors from '../../../constants/colors';
import {hasPremiumPlus} from '../../../helpers/hasPremiumPlus';
import {useAppSelector} from '../../../hooks/redux';
import Header from '../../commons/Header';

const PremiumPurchased: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PremiumPurchased'>;
  route: RouteProp<StackParamList, 'PremiumPurchased'>;
}> = ({route}) => {
  const {restored} = route.params;
  const {profile} = useAppSelector(state => state.profile);
  const premiumPlusActive = hasPremiumPlus(profile.premium);
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack />
      <View style={{flex: 1, padding: 20, paddingTop: 50}}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 'bold',
          }}>
          {restored
            ? `Premium${premiumPlusActive ? ' Plus' : ''} restored!`
            : 'Thank you for your purchase!'}
        </Text>
        {premiumPlusActive ? (
          <LottieView
            source={require('../../../animations/fireworks.json')}
            autoPlay
            loop
            style={{width: '100%', height: 300}}
          />
        ) : (
          <LottieView
            source={require('../../../animations/tick.json')}
            autoPlay
            loop={false}
            style={{width: '100%', height: 300}}
          />
        )}
        <Text
          style={{
            color: colors.appWhite,
            marginBottom: 20,
            textAlign: 'center',
            fontSize: FONTS_SIZES.MEDIUM_LARGE,
          }}>
          {premiumPlusActive
            ? 'Are you ready to elevate your fitness game? Check your messages for the next steps!'
            : 'Enjoy full acccess to all content and features!'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PremiumPurchased;
