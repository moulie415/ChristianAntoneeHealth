import React from 'react';
import {Text as UIText, TextProps} from '@ui-kitten/components';

const Text: React.FC<TextProps> = ({children, ...props}) => {
  return <UIText {...props}>{children}</UIText>;
};

export default Text;
