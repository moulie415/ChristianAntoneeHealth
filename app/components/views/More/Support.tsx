import React from 'react';
import {
  View,
  Linking,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import DevicePixels from '../../../helpers/DevicePixels';
import SupportProps from '../../../types/views/Support';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import Instabug from 'instabug-reactnative';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTourGuideController} from 'rn-tourguide';
import {ListItem, MoreItem} from './More';
import {navigate} from '../../../RootNavigation';

const Support: React.FC<SupportProps> = () => {
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    getCurrentStep,
  } = useTourGuideController();

  const items: ListItem[] = [
    {
      title: 'Privacy Policy',
      icon: 'check-circle',
      onPress: () =>
        Linking.openURL('https://christianantonee.com/privacy-policy'),
    },
    {
      title: 'Report a problem',
      icon: 'bug',
      onPress: () => Instabug.show(),
    },
    {
      title: 'Contact us',
      icon: 'envelope',
      onPress: () => {
        try {
          Linking.openURL('mailto:info@christianantonee.com?subject=CA Health');
        } catch (e) {
          Linking.openURL('https://christianantonee.com/contact');
        }
      },
    },
    {
      title: 'Restart tour',
      icon: 'sign',
      onPress: () => {
        navigate('Home');
        start();
      },
    },
  ];

  return (
    <FastImage
      source={require('../../../images/login.jpeg')}
      blurRadius={7}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Support" />
        <FlatList
          data={items}
          contentContainerStyle={{marginTop: DevicePixels[20]}}
          renderItem={({item}) => {
            return <MoreItem item={item} />;
          }}
        />
      </SafeAreaView>
    </FastImage>
  );
};

export default Support;
