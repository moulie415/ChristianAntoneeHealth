import React from 'react';
import ViewMoreText from 'react-native-view-more-text';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
import Text from './Text';

const ViewMore = ({text, lines}: {text: string; lines?: number}) => {
  const renderViewMore = (onPress: () => void) => {
    return (
      <Text
        style={{
          margin: DevicePixels[10],
          marginTop: 0,
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
          margin: DevicePixels[10],
          marginTop: 0,
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
        margin: DevicePixels[10],
        marginBottom: 0,
  
      }}>
      <Text style={{color: colors.appWhite}}>{text}</Text>
    </ViewMoreText>
  );
};

export default ViewMore;
