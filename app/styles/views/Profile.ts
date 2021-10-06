import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  title: {
    color: '#fff',
  },
  container: {
    flex: 1,
  },
  avatar: {
    width: DevicePixels[50],
    height: DevicePixels[50],
    borderRadius: DevicePixels[50],
  },
});
