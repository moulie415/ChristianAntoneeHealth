import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  title: {
    fontSize: DevicePixels[28],
  },
  row: {
    flex: 1,
    borderBottomWidth: 0.3,
    borderTopWidth: 0.3,
    borderBottomColor: colors.borderColor,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    margin: DevicePixels[30],
    flex: 1,
    textAlign: 'center',
    fontSize: DevicePixels[21],
  },
});
