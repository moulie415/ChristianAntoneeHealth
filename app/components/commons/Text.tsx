import React from 'react';
import {Text as RNText, TextProps} from 'react-native';

interface Props extends TextProps {
  variant?: 'bold' | 'italic' | 'bolditalic';
}

const Text: React.FC<Props> = ({children, variant, ...props}) => {
  const getFontFamily = () => {
    if (variant) {
      if (variant === 'bolditalic') {
        return 'MontserratAlternates-BoldItalic';
      }
      if (variant === 'bold') {
        return 'MontserratAlternates-Bold';
      }
      if (variant === 'italic') {
        return 'MontserratAlternates-Italic';
      }
    }
    return 'MontserratAlternates-Regular';
  };
  return (
    <RNText {...props} style={[{fontFamily: getFontFamily()}, props.style]}>
      {children}
    </RNText>
  );
};

export default Text;
