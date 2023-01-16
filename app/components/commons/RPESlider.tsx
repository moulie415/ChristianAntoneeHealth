import {View, Text} from 'react-native';
import React from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import {Slider} from '@miblanchard/react-native-slider';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

const sliderScale: {
  rpe: number;
  title: string;
  description: string;
}[] = [
  {
    rpe: 1,
    title: 'Very light activity',
    description:
      'Hardly any exertion, but more than sleeping, watching TV, etc',
  },
  {
    rpe: 2,
    title: 'Light activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
  },
  {
    rpe: 3,
    title: 'Light activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
  },

  {
    rpe: 4,
    title: 'Moderate activity',
    description:
      '',
  },

  
];

const RPESlider = () => {
  return (
    <View>
      <Text
        style={{
          margin: DevicePixels[10],
          marginTop: DevicePixels[20],
          color: colors.appWhite,
        }}>
        Rate your performance to help us understand your fitness level
      </Text>

      <Slider
        minimumValue={0}
        maximumValue={3}
        step={1}
        value={difficulty}
        renderThumbComponent={() => {
          return (
            <View
              style={{
                backgroundColor: colors.appWhite,
                height: DevicePixels[30],
                width: DevicePixels[30],
                borderRadius: DevicePixels[15],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LinearGradient
                colors={['#294195', '#121617']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0.5}}
                style={{
                  height: DevicePixels[26],
                  width: DevicePixels[26],
                  borderRadius: DevicePixels[13],
                }}
              />
            </View>
          );
        }}
        minimumTrackTintColor={colors.appBlue}
        maximumTrackTintColor={colors.appWhite}
        containerStyle={{marginHorizontal: DevicePixels[20]}}
        onValueChange={val => typeof val === 'object' && setDifficulty(val[0])}
      />

      <View
        style={{
          margin: DevicePixels[10],
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: DevicePixels[30],
            textAlign: 'center',
            margin: DevicePixels[10],
          }}>
          {emoji}
        </Text>
        <Text style={{color: colors.appWhite, fontWeight: 'bold', flex: 1}}>
          {text}
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'normal',
            }}>{` - ${subtext}`}</Text>
        </Text>
      </View>
    </View>
  );
};

export default RPESlider;
