import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';

import Config from 'react-native-config';
import {navigate} from '../../../RootNavigation';
import SupportProps from '../../../types/views/Support';
import Header from '../../commons/Header';
import {ListItem, MoreItem} from './DrawerContent';

const Support: React.FC<SupportProps> = () => {
  const items: ListItem[] = [
    {
      title: 'Privacy Policy',
      icon: 'check-circle',
      onPress: () =>
        navigate('PDFViewer', {
          uri: Config.PRIVACY_POLICY as string,
          title: 'Privacy Policy',
        }),
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
