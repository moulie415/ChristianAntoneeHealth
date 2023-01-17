import {View} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import {Slider} from '@miblanchard/react-native-slider';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {getDifficultyEmoji} from '../../helpers/exercises';
import Text from './Text';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

export const rpeSliderScale: {
  rpe: number;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    rpe: 1,
    title: 'Very light activity',
    description:
      'Hardly any exertion, but more than sleeping, watching TV, etc',
    color: colors.appGreen,
  },
  {
    rpe: 2,
    title: 'Light activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
    color: colors.appBlueLight,
  },
  {
    rpe: 3,
    title: 'Light activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
    color: colors.appBlueLight,
  },

  {
    rpe: 4,
    title: 'Moderate activity',
    description:
      'Breathing heavily, can hold a short conversation. Still somewhat comfortable, but becoming noticeably more challenging',
    color: colors.appBlue,
  },

  {
    rpe: 5,
    title: 'Moderate activity',
    description:
      'Breathing heavily, can hold a short conversation. Still somewhat comfortable, but becoming noticeably more challenging',
    color: colors.appBlue,
  },
  {
    rpe: 6,
    title: 'Moderate activity',
    description:
      'Breathing heavily, can hold a short conversation. Still somewhat comfortable, but becoming noticeably more challenging',
    color: colors.appBlue,
  },
  {
    rpe: 7,
    title: 'Vigorous activity',
    description:
      'Borderline uncomfortable. Short of breath, can speak a sentence',
    color: colors.secondaryLight,
  },
  {
    rpe: 8,
    title: 'Vigorous activity',
    description:
      'Borderline uncomfortable. Short of breath, can speak a sentence',
    color: colors.secondaryLight,
  },
  {
    rpe: 9,
    title: 'Very hard activity',
    description:
      'Very difficult to maintain exercise intensity. Can barely breathe and speak only a few words',
    color: colors.secondaryDark,
  },
  {
    rpe: 10,
    title: 'Max effort activity',
    description:
      'Feels almost impossible to keep going. Completely out of breath, unable to talk. Cannot maintain for more tan a very short time',
    color: colors.appRed,
  },
];

const RPESlider: React.FC<{rpe: number; setRpe: (val: number) => void}> = ({
  rpe,
  setRpe,
}) => {
  return (
    <View>
      <Text
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          fontSize: DevicePixels[25],
          marginBottom: DevicePixels[20],
        }}>
        Rate of perceived exertion{' '}
        <Text style={{fontWeight: 'bold'}}>(RPE)</Text>
      </Text>
      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={DevicePixels[120]}
        width={DevicePixels[15]}
        backgroundWidth={DevicePixels[5]}
        fill={10 * rpe}
        tintColor={rpeSliderScale[rpe - 1].color}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.appWhite}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => (
          <Text
            style={{
              fontSize: DevicePixels[30],
              color: colors.appWhite,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {rpe}
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text
        style={{
          margin: DevicePixels[10],
          marginTop: DevicePixels[20],
          color: colors.appWhite,
          textAlign: 'center'
        }}>
        How hard did you find that workout?
      </Text>

      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={rpe}
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
        onValueChange={val => typeof val === 'object' && setRpe(val[0])}
      />

      <View
        style={{
          margin: DevicePixels[10],
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          height: DevicePixels[100],
        }}>
        <Text
          style={{
            fontSize: DevicePixels[30],
            textAlign: 'center',
            width: DevicePixels[60],
          }}>
          {getDifficultyEmoji(rpe)}
        </Text>
        <Text style={{color: colors.appWhite, fontWeight: 'bold', flex: 1}}>
          {rpeSliderScale[rpe - 1].title}
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'normal',
            }}>{` - ${rpeSliderScale[rpe - 1].description}`}</Text>
        </Text>
      </View>
    </View>
  );
};

export default RPESlider;
