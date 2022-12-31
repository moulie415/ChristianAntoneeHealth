import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Tooltip from 'react-native-walkthrough-tooltip';
import {connect} from 'react-redux';
import {incrementStep} from '../../../actions/tour';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {MyRootState} from '../../../types/Shared';
import Header from '../../commons/Header';
import Text from '../../commons/Text';

const WhatArea: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WhatArea'>;
  route: RouteProp<StackParamList, 'WhatArea'>;
  step: number;
  incrementStep: () => void;
}> = ({navigation, route, incrementStep: increment, step}) => {
  const {equipment} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />

        <Text
          style={{
            color: colors.appWhite,
            margin: DevicePixels[20],
            fontSize: DevicePixels[22],
            fontWeight: 'bold',
          }}>
          What area do you want to focus on?
        </Text>
        <Tooltip
          isVisible={step && step === 3}
          content={<Text>Select the body area you want to focus on</Text>}
          placement="bottom"
          onClose={() => {
            increment();
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutList', {equipment, area: 'upper'})
            }
            style={{
              margin: DevicePixels[20],
              marginTop: DevicePixels[5],
              borderRadius: DevicePixels[5],
              width: Dimensions.get('window').width - DevicePixels[40],
            }}>
            <FastImage
              style={{
                height: DevicePixels[120],
                justifyContent: 'flex-end',
                borderRadius: DevicePixels[10],
              }}
              source={require('../../../images/upper-body.jpg')}>
              <View
                style={{
                  height: DevicePixels[120],
                  justifyContent: 'center',
                  borderRadius: DevicePixels[10],
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    marginLeft: DevicePixels[25],
                    fontSize: DevicePixels[22],
                  }}>
                  UPPER BODY
                </Text>
              </View>
            </FastImage>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutList', {equipment, area: 'lower'})
            }
            style={{
              margin: DevicePixels[20],
              marginTop: DevicePixels[5],
              borderRadius: DevicePixels[5],
              width: Dimensions.get('window').width - DevicePixels[40],
            }}>
            <FastImage
              style={{
                height: DevicePixels[120],
                justifyContent: 'flex-end',
                borderRadius: DevicePixels[10],
              }}
              source={require('../../../images/lower-body.jpg')}>
              <View
                style={{
                  height: DevicePixels[120],
                  justifyContent: 'center',
                  borderRadius: DevicePixels[10],
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    marginLeft: DevicePixels[25],
                    fontSize: DevicePixels[22],
                  }}>
                  LOWER BODY
                </Text>
              </View>
            </FastImage>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutList', {equipment, area: 'full'})
            }
            style={{
              margin: DevicePixels[20],
              marginTop: DevicePixels[5],
              borderRadius: DevicePixels[5],
              width: Dimensions.get('window').width - DevicePixels[40],
            }}>
            <FastImage
              style={{
                height: DevicePixels[120],
                justifyContent: 'flex-end',
                borderRadius: DevicePixels[10],
              }}
              source={require('../../../images/full-body.jpg')}>
              <View
                style={{
                  height: DevicePixels[120],
                  justifyContent: 'center',
                  borderRadius: DevicePixels[10],
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    marginLeft: DevicePixels[25],
                    fontSize: DevicePixels[22],
                  }}>
                  FULL BODY
                </Text>
              </View>
            </FastImage>
          </TouchableOpacity>
        </Tooltip>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({tour}: MyRootState) => ({
  step: tour.step,
});

const mapDispatchToProps = {
  incrementStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(WhatArea);
