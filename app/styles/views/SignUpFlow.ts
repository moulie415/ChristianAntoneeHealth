import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    margin: DevicePixels[10],
    marginTop: DevicePixels[60],
    height: DevicePixels[75],
    width: DevicePixels[75],
    alignSelf: 'center',
  },
  icon: {
    color: colors.appBlue,
  },
  input: {
    width: DevicePixels[225],
  },
});
