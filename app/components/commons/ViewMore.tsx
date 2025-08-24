import React from 'react';
import ViewMoreText from 'react-native-view-more-text';
import colors from '../../constants/colors';

import Text from './Text';

const ViewMore = ({
  text,
  lines,
  textAlign,
}: {
  text: string;
  lines?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
}) => {
  const renderViewMore = (onPress: () => void) => {
    return (
      <Text
        style={{
          color: colors.appBlue,
          fontWeight: 'bold',
        }}
        onPress={onPress}>
        View more
      </Text>
    );
  };

  const renderViewLess = (onPress: () => void) => {
    return (
      <Text
        style={{
          color: colors.appBlue,
          fontWeight: 'bold',
        }}
        onPress={onPress}>
        View less
      </Text>
    );
  };
  return (
    <ViewMoreText
      renderViewMore={renderViewMore}
      renderViewLess={renderViewLess}
      numberOfLines={lines || 3}
      textStyle={{
        lineHeight: 25,
        textAlign,
      }}>
      <Text style={{color: colors.appWhite, textAlign}}>{text}</Text>
    </ViewMoreText>
  );
};

export default ViewMore;
