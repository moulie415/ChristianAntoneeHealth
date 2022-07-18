import React from 'react';
import {Text, TextProps} from 'react-native';

interface Props extends TextProps {
  variant?: 'bold' | 'italic' | 'bolditalic';
}

const CAText: React.FC<Props> = ({children, variant, ...props}) => {
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
    <Text {...props} style={[{fontFamily: getFontFamily()}, props.style]}>
      {children}
    </Text>
  );
};

export default CAText;
