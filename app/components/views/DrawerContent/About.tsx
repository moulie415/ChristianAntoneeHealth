import React from 'react';
import {
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../../constants/colors';
import AboutProps from '../../../types/views/About';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';

const About: React.FC<AboutProps> = () => {
  return (
    <>
      <FastImage
        source={require('../../../images/christian-welcome.jpg')}
        style={{height: 570}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.3,
          }}
        />
        <SafeAreaView>
          <Header hasBack title="About us" />
        </SafeAreaView>
      </FastImage>
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: colors.appGrey,
          marginTop: -300,
        }}>
        <ScrollView contentContainerStyle={{flex: 1}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 10,
              paddingHorizontal: 20,
              marginTop: 20,
            }}
            onPress={() => Linking.openURL('https://christianantonee.com')}>
            <View style={{width: 40}}>
              <Icon name="mouse-pointer" size={20} color="#fff" />
            </View>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                flex: 1,
              }}>
              Website
            </Text>
            <Icon
              style={{opacity: 0.8}}
              name="chevron-right"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 10,
              paddingHorizontal: 20,
            }}
            onPress={() =>
              Linking.openURL('https://www.instagram.com/christian_antonee/')
            }>
            <View style={{width: 40}}>
              <Icon name="instagram" size={20} color="#fff" />
            </View>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                flex: 1,
              }}>
              Instagram
            </Text>
            <Icon
              style={{opacity: 0.8}}
              name="chevron-right"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.appWhite,

              lineHeight: 30,
              margin: 10,
            }}>
            My name is Christian Antonee and I work as a Personal Trainer and
            Osteopath in London, England. My brother-in-law Henry and I
            developed this app together to help people stay fit and strong in
            the wake of a global pandemic. Our vision for this project is to
            continue to support my existing client base here in London, but also
            to provide a valuable tool for the wider health and fitness
            community. We’re grateful to you for letting us be a part of your
            health and fitness journey, and hope trust that CA Health will help
            you reach your lifestyle goals.
          </Text>
        </ScrollView>
      </View>
    </>
  );
};

export default About;
