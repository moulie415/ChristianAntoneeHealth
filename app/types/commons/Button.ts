import {StyleProp, ViewStyle, TextStyle} from 'react-native';

export default interface ButtonProps {
  color?: string;
  textColor?: string;
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}
