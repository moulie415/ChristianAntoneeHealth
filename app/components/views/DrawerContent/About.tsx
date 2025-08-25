import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import AboutProps from '../../../types/views/About';
import Header from '../../commons/Header';
import Text from '../../commons/Text';

const About: React.FC<AboutProps> = () => {
  return (
    <>
      <ImageBackground
        source={require('../../../images/christian-welcome.jpg')}
        style={{ height: 640 }}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.3,
          }}
        />
        <SafeAreaView>
          <Header hasBack title="" />
        </SafeAreaView>
      </ImageBackground>
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: colors.appGrey,
          marginTop: -300,
        }}
      >
        <ScrollView>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 10,
              paddingHorizontal: 20,
              marginTop: 20,
            }}
            onPress={() => Linking.openURL('https://christianantonee.com')}
          >
            <View style={{ width: 40 }}>
              <FontAwesome6
                iconStyle="solid"
                name="globe"
                size={20}
                color="#fff"
              />
            </View>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                flex: 1,
              }}
            >
              Website
            </Text>
            <FontAwesome6
              iconStyle="solid"
              style={{ opacity: 0.8 }}
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
            }
          >
            <View style={{ width: 40 }}>
              <FontAwesome6
                iconStyle="brand"
                name="instagram"
                size={20}
                color="#fff"
              />
            </View>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                flex: 1,
              }}
            >
              Instagram
            </Text>
            <FontAwesome6
              iconStyle="solid"
              style={{ opacity: 0.8 }}
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
            onPress={async () => {
              try {
                await Linking.openURL(
                  encodeURI(
                    'mailto:info@christianantonee.com?subject=CA Health',
                  ),
                );
              } catch (e) {
                Linking.openURL('https://christianantonee.com/contact');
              }
            }}
          >
            <View style={{ width: 40 }}>
              <FontAwesome6 name="envelope" size={20} color="#fff" />
            </View>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                flex: 1,
              }}
            >
              Contact us
            </Text>
            <FontAwesome6
              iconStyle="solid"
              style={{ opacity: 0.8 }}
              name="chevron-right"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.appWhite,
              lineHeight: 25,
              margin: 10,
              marginHorizontal: 20,
              fontSize: 13,
              textAlign: 'justify',
            }}
          >
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
