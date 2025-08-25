import { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StackParamList } from '../../../App';
import colors from '../../../constants/colors';
import Header from '../../commons/Header';

const PlanSleep: React.FC<{ route: RouteProp<StackParamList, 'Sleep'> }> = ({
  route,
}) => {
  const { sleep } = route.params;
  return (
    <ScrollView bounces={false} style={{ backgroundColor: colors.appGrey }}>
      <ImageBackground
        style={{
          height: 350,
          marginBottom: 10,
        }}
        source={require('../../../images/sleep.jpg')}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.4,
          }}
        />
      </ImageBackground>

      <Header hasBack absolute title="Sleep" />

      <View
        style={{
          padding: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -100,
          backgroundColor: colors.appGrey,
        }}
      >
        {!!sleep.general && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',

                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}
            >
              General
            </Text>
            <Text
              style={{
                color: colors.appWhite,

                lineHeight: 30,
              }}
            >
              {sleep.general}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default PlanSleep;
