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

import SupportProps from '../../../types/views/Support';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {ListItem, MoreItem} from './DrawerContent';
import {navigate} from '../../../RootNavigation';

const Support: React.FC<SupportProps> = () => {
  const items: ListItem[] = [
    {
      title: 'Privacy Policy',
      icon: 'check-circle',
      onPress: () =>
        Linking.openURL('https://christianantonee.com/privacy-policy'),
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
          contentContainerStyle={{marginTop: 20}}
          renderItem={({item}) => {
            return <MoreItem item={item} />;
          }}
        />
      </SafeAreaView>
    </FastImage>
  );
};

export default Support;
