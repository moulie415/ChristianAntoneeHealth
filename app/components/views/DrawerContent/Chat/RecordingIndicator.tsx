import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../../../constants/colors';

const waves = [...Array(20).keys()];

const Wave: React.FC<{ metering: number | undefined; index: number }> = ({
  metering,
  index,
}) => {
  const height = useSharedValue(5);
  useEffect(() => {
    const multiplier = 1 - Math.abs(index - 10) / 10;
    const val = metering && multiplier * (metering + 35);
    height.value = withTiming(
      val && val > 5 ? 5 + multiplier * (metering + 30) : 5,
      {
        duration: 100,
        easing: Easing.ease,
      },
    );
  }, [metering, height, index]);
  const style = useAnimatedStyle(() => {
    return {
      height: height.value,
      width: 5,
      marginHorizontal: 2,
      backgroundColor: colors.appBlue,
    };
  });
  return <Animated.View style={style} />;
};

const RecordingIndicator: React.FC<{ metering: number | undefined }> = ({
  metering,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 30,
        alignItems: 'flex-end',
        marginLeft: 10,
      }}
    >
      {waves.map((wave, index) => (
        <Wave index={index + 1} metering={metering} key={wave} />
      ))}
    </View>
  );
};

export default RecordingIndicator;
