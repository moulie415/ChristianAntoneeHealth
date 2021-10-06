import {Text} from '@ui-kitten/components';
import React from 'react';
import ViewMoreText from 'react-native-view-more-text';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

const ViewMore = ({text}: {text: string}) => {
  const renderViewMore = (onPress: () => void) => {
    return (
      <Text
        style={{margin: DevicePixels[10], marginTop: 0, color: colors.appBlue}}
        onPress={onPress}>
        View more
      </Text>
    );
  };

  const renderViewLess = (onPress: () => void) => {
    return (
      <Text
        style={{margin: DevicePixels[10], marginTop: 0, color: colors.appBlue}}
        onPress={onPress}>
        View less
      </Text>
    );
  };
  return (
    <ViewMoreText
      renderViewMore={renderViewMore}
      renderViewLess={renderViewLess}
      numberOfLines={3}
      textStyle={{margin: DevicePixels[10], marginBottom: 0}}>
      <Text>{text}</Text>
    </ViewMoreText>
  );
};

export default ViewMore;
