import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../constants/colors';
import Text from './Text';

interface Props {
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  children?: any;
}

const Button = ({wrapperStyle, style, children, ...rest}: Props) => (
  <View style={[styles.button, wrapperStyle]}>
    <Text
      style={[styles.buttonText, style]}
      testID={'TourGuideButtonText'}
      {...rest}>
      {children}
    </Text>
  </View>
);

export type Shape =
  | 'circle'
  | 'rectangle'
  | 'circle_and_keep'
  | 'rectangle_and_keep';

export interface BorderRadiusObject {
  topLeft?: number;
  topRight?: number;
  bottomRight?: number;
  bottomLeft?: number;
}

interface IStep {
  name: string;
  order: number;
  visible?: boolean;
  target: any;
  text: string;
  wrapper: any;
  shape?: Shape;
  maskOffset?: number;
  borderRadius?: number;
  keepTooltipPosition?: boolean;
  tooltipBottomOffset?: number;
  borderRadiusObject?: BorderRadiusObject;
}

interface Labels {
  skip?: string;
  previous?: string;
  next?: string;
  finish?: string;
}

interface TooltipProps {
  isFirstStep?: boolean;
  isLastStep?: boolean;
  currentStep: IStep;
  labels?: Labels;
  handleNext?: () => void;
  handlePrev?: () => void;
  handleStop?: () => void;
}

const CustomTooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
}: TooltipProps) => (
  <View
    style={{
      borderRadius: 16,
      paddingTop: 24,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 16,
      width: '80%',
      backgroundColor: '#ffffffef',
    }}>
    <View style={styles.tooltipContainer}>
      <Text testID="stepDescription" style={styles.tooltipText}>
        {currentStep && currentStep.text}
      </Text>
    </View>
    <View style={[styles.bottomBar]}>
      {!isLastStep ? (
        <TouchableOpacity onPress={handleStop}>
          <Button>{labels?.skip || 'Skip'}</Button>
        </TouchableOpacity>
      ) : null}
      {!isFirstStep ? (
        <TouchableOpacity onPress={handlePrev}>
          <Button>{labels?.previous || 'Previous'}</Button>
        </TouchableOpacity>
      ) : null}
      {!isLastStep ? (
        <TouchableOpacity onPress={handleNext}>
          <Button>{labels?.next || 'Next'}</Button>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleStop}>
          <Button>{labels?.finish || 'Finish'}</Button>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default CustomTooltip;

const styles = StyleSheet.create({
  tooltipText: {
    textAlign: 'center',
  },
  tooltipContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: colors.appBlue,
    fontWeight: 'bold',
  },
  bottomBar: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
