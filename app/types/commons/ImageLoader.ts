import {ImageProps} from 'react-native';

export default interface ImageLoaderProps extends ImageProps {
  delay?: number;
  overlay?: boolean;
}
