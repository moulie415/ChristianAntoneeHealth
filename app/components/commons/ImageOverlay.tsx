import {Layout} from '@ui-kitten/components';
import React, {ReactElement} from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  TextStyle,
  ViewStyle,
} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';

const {width} = Dimensions.get('window');

interface ImageOverlayProps {
  rounded?: number;
  source: ImageSourcePropType;
  height?: number;
  title?: string;
  titleStyle?: TextStyle;
  overlayColor?: string;
  overlayAlpha?: number;
  contentPosition?: 'top' | 'center' | 'bottom';
  containerStyle?: ViewStyle;
  blurRadius?: number;
  children?: ReactElement;
  onLoad?: () => void;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  blurRadius,
  children,
  containerStyle,
  contentPosition = 'center',
  height = DevicePixels[300],
  overlayAlpha = 0.5,
  overlayColor = '#000000',
  rounded,
  source,
  title,
  titleStyle,
  onLoad,
}) => {
  const getJustifyContent = () => {
    if (contentPosition === 'top') {
      return 'flex-start';
    }
    if (contentPosition === 'bottom') {
      return 'flex-end';
    }
    return 'center';
  };
  const justifyContent = getJustifyContent();
  return (
    <ImageBackground
      source={source}
      onLoad={onLoad}
      style={[
        styles.image,
        {
          borderRadius: rounded,
          height,
          justifyContent,
        },
        containerStyle,
      ]}
      blurRadius={blurRadius}>
      <Layout
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: overlayColor,
          opacity: overlayAlpha,
        }}
      />
      {!children && title && (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      )}
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    overflow: 'hidden',
    alignItems: 'center',
  },
  title: {
    margin: DevicePixels[20],
    color: 'white',
    textAlign: 'center',
    fontSize: DevicePixels[16],
  },
});

export default ImageOverlay;
