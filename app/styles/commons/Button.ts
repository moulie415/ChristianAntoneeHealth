import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  button: {
    padding: DevicePixels[15],
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  text: {
    color: '#000',
    textTransform: 'uppercase',
  },
});
