import Color from 'color';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, {RadialGradient, Defs, Rect, Stop} from 'react-native-svg';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Button from '../Button';
import Input from '../Input';

const {width, height} = Dimensions.get('screen');
const SIZE = width - 250;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: DevicePixels[75],
    paddingBottom: 0,
    paddingTop: DevicePixels[100],
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    height: DevicePixels[125],
    resizeMode: 'contain',
  },
  title: {
    fontSize: DevicePixels[48],
    color: 'white',
    textAlign: 'center',
    marginBottom: DevicePixels[16],
    // fontFamily: 'SFProDisplay-Bold',
  },
  description: {
    fontSize: DevicePixels[18],
    color: 'white',
    textAlign: 'center',
    // fontFamily: 'SFProDisplay-Regular',
  },
});

export interface SlideProps {
  slide: {
    color: string;
    picture: ReturnType<typeof require>;
    elements: JSX.Element;
    showNext: boolean;
    tint?: string;
  };
}

const Slide = ({slide: {picture, color, elements, tint}}: SlideProps) => {
  const lighterColor = Color(color).lighten(0.8).toString();
  return (
    <>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="gradient" cx="50%" cy="35%">
            <Stop offset="0%" stopColor={lighterColor} />
            <Stop offset="100%" stopColor={color} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#gradient)" />
      </Svg>
      <View style={styles.container}>
        <Image
          source={require('../../../images/health_and_movement_logo_colour_centred.png')}
          style={[styles.image, {tintColor: tint || colors.appBlue}]}
        />

        {elements}
      </View>
    </>
  );
};

export default Slide;
