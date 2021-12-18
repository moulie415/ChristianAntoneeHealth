import {StyleSheet} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  lockIcon: {
    height: DevicePixels[50],
    width: DevicePixels[75],
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  routineText: {color: '#fff', fontSize: DevicePixels[12]},
  center: {
    alignItems: 'center',
  },
  padding: {padding: DevicePixels[10]},
  textWhite: {
    color: '#fff',
  },
  imageContainer: {
    height: DevicePixels[75],
    width: DevicePixels[75],
  },
});
