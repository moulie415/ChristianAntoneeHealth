import {View} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../../../constants/colors';

const waves = [...Array(20).keys()];

const Wave: React.FC<{metering: number | undefined}> = ({metering}) => {
  const height = useSharedValue(5);
  useEffect(() => {
    const val = metering && Math.floor(Math.random() * (metering + 35));
    height.value = withTiming(
      val && val > 5 ? 5 + Math.floor(Math.random() * (metering + 30)) : 5,
      {
        duration: 100,
        easing: Easing.ease,
      },
    );
  }, [metering, height]);
  const style = useAnimatedStyle(() => {
    return {
      height: height.value,
      width: 5,
      marginHorizontal: 2,
      backgroundColor: colors.appBlue,
    };
  });
  console.log(height.value);
  return <Animated.View style={style} />;
};

const RecordingIndicator: React.FC<{metering: number | undefined}> = ({
  metering,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 30,
        alignItems: 'flex-end',
        marginLeft: 10,
      }}>
      {waves.map(wave => (
        <Wave metering={metering} key={wave} />
      ))}
    </View>
  );
};

export default RecordingIndicator;
