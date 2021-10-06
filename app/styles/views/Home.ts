import {StyleSheet} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: DevicePixels[20],
    paddingHorizontal: DevicePixels[40],
  },
  title: {
    fontSize: DevicePixels[36],
  },
});
