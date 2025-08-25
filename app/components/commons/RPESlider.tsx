import { Slider } from '@miblanchard/react-native-slider';
import Color from 'color';
import React from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FONTS_SIZES } from '../../constants';
import colors from '../../constants/colors';
import ResistanceScaleInfo from '../views/Workout/ResistanceScaleInfo';
import Text from './Text';
import Tile from './Tile';

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
    color: Color(colors.appBlue).lighten(0.9).hex(),
  },
  {
    rpe: 2,
    title: 'Light activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
    color: Color(colors.appBlue).lighten(0.7).hex(),
  },
  {
    rpe: 3,
    title: 'Light activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
    color: Color(colors.appBlue).lighten(0.7).hex(),
  },

  {
    rpe: 4,
    title: 'Moderate activity',
    description:
      'Breathing heavily, can hold a short conversation. Still somewhat comfortable, but becoming noticeably more challenging',
    color: Color(colors.appBlue).lighten(0.6).hex(),
  },

  {
    rpe: 5,
    title: 'Moderate activity',
    description:
      'Breathing heavily, can hold a short conversation. Still somewhat comfortable, but becoming noticeably more challenging',
    color: Color(colors.appBlue).lighten(0.6).hex(),
  },
  {
    rpe: 6,
    title: 'Moderate activity',
    description:
      'Breathing heavily, can hold a short conversation. Still somewhat comfortable, but becoming noticeably more challenging',
    color: Color(colors.appBlue).lighten(0.6).hex(),
  },
  {
    rpe: 7,
    title: 'Vigorous activity',
    description:
      'Borderline uncomfortable. Short of breath, can speak a sentence',
    color: Color(colors.appBlue).lighten(0.4).hex(),
  },
  {
    rpe: 8,
    title: 'Vigorous activity',
    description:
      'Borderline uncomfortable. Short of breath, can speak a sentence',
    color: Color(colors.appBlue).lighten(0.4).hex(),
  },
  {
    rpe: 9,
    title: 'Very hard activity',
    description:
      'Very difficult to maintain exercise intensity. Can barely breathe and speak only a few words',
    color: Color(colors.appBlue).lighten(0.3).hex(),
  },
  {
    rpe: 10,
    title: 'Max effort activity',
    description:
      'Feels almost impossible to keep going. Completely out of breath, unable to talk. Cannot maintain for more tan a very short time',
    color: colors.appBlue,
  },
];

const RPESlider: React.FC<{ rpe: number; setRpe: (val: number) => void }> = ({
  rpe,
  setRpe,
}) => {
  return (
    <View>
      <Tile style={{ margin: 20, marginVertical: 10, paddingTop: 10 }}>
        <Text
          style={{
            margin: 10,
            marginBottom: 20,
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: FONTS_SIZES.MEDIUM_LARGE,
          }}
        >
          How hard did you find that workout?
        </Text>
        <AnimatedCircularProgress
          style={{ alignSelf: 'center' }}
          size={120}
          width={10}
          backgroundWidth={10}
          fill={10 * rpe}
          tintColor={rpeSliderScale[rpe - 1].color}
          // tintColorSecondary={colors.appBlueFaded}
          backgroundColor={colors.appWhite}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
        >
          {(fill: number) => (
            <Text
              style={{
                fontSize: 30,
                color: colors.appWhite,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {rpe}
            </Text>
          )}
        </AnimatedCircularProgress>

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
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    height: 26,
                    width: 26,
                    borderRadius: 13,
                    backgroundColor: colors.appBlue,
                  }}
                />
              </View>
            );
          }}
          minimumTrackTintColor={colors.appBlue}
          maximumTrackTintColor={colors.appWhite}
          containerStyle={{ marginHorizontal: 20 }}
          onValueChange={val => typeof val === 'object' && setRpe(val[0])}
        />
        <ResistanceScaleInfo />
      </Tile>
    </View>
  );
};

export default RPESlider;
