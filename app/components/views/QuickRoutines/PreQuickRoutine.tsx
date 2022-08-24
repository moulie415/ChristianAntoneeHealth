import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter, getVideoHeight} from '../../../helpers';
import Header from '../../commons/Header';
import DevicePixels from '../../../helpers/DevicePixels';
import Button from '../../commons/Button';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, View} from 'react-native';

const PreQuickRoutine: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PreQuickRoutine'>;
  route: RouteProp<StackParamList, 'PreQuickRoutine'>;
}> = ({route, navigation}) => {
  const {
    routine: {
      name,
      thumbnail,
      area,
      duration,
      equipment,
      level,
      exerciseIds,
      instructions,
    },
  } = route.params;
  return (
    <>
      <FastImage
        source={{uri: thumbnail?.src}}
        style={{height: getVideoHeight()}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.5,
          }}
        />
        <SafeAreaView>
          <Header hasBack />
        </SafeAreaView>
      </FastImage>
      <FastImage
        source={require('../../../images/old-black-background-grunge.png')}
        style={{
          flex: 1,
          borderTopLeftRadius: DevicePixels[30],
          borderTopRightRadius: DevicePixels[30],
          marginTop: -DevicePixels[30],
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: DevicePixels[30],
            marginBottom: DevicePixels[10],
            fontSize: DevicePixels[20],
          }}>
          {name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: DevicePixels[10],
          }}>
          <View style={{width: DevicePixels[55], alignItems: 'center'}}>
            <Icon
              name="stopwatch"
              size={DevicePixels[25]}
              color={colors.appWhite}
              style={{
                marginHorizontal: DevicePixels[15],
              }}
            />
          </View>
          <Text
            style={{color: colors.appWhite}}>{`Under ${duration} mins`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: DevicePixels[10],
          }}>
          <View style={{width: DevicePixels[55], alignItems: 'center'}}>
            <Icon
              name="running"
              size={DevicePixels[25]}
              color={colors.appWhite}
              style={{
                marginHorizontal: DevicePixels[15],
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>{`${exerciseIds.length} ${
            exerciseIds.length > 1 ? 'exercises' : 'exercise'
          } `}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: DevicePixels[10],
          }}>
          <View style={{width: DevicePixels[55], alignItems: 'center'}}>
            <Icon
              name="tachometer-alt"
              size={DevicePixels[22]}
              color={colors.appWhite}
              style={{
                marginHorizontal: DevicePixels[15],
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>
            {capitalizeFirstLetter(level)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: DevicePixels[10],
          }}>
          <View style={{width: DevicePixels[55], alignItems: 'center'}}>
            <Icon
              name="dumbbell"
              size={DevicePixels[20]}
              color={colors.appWhite}
              style={{
                marginHorizontal: DevicePixels[15],
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>{`${capitalizeFirstLetter(
            equipment,
          )} equipment`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: DevicePixels[10],
          }}>
          <View style={{width: DevicePixels[55], alignItems: 'center'}}>
            <Icon
              name="child"
              size={DevicePixels[25]}
              color={colors.appWhite}
              style={{
                marginHorizontal: DevicePixels[15],
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>{`${capitalizeFirstLetter(
            area,
          )} body`}</Text>
        </View>
        <Button
          style={{margin: DevicePixels[15]}}
          text="Start workout"
          onPress={() =>
            navigation.navigate('QuickRoutine', {routine: route.params.routine})
          }
        />
      </FastImage>
    </>
  );
};

export default PreQuickRoutine;
