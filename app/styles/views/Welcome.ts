import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  logo: {
    margin: DevicePixels[10],
    marginTop: DevicePixels[100],
    marginBottom: DevicePixels[60],
    height: DevicePixels[78],
    width: DevicePixels[75],
    alignSelf: 'center',
  },
  versionNumber: {
    textAlign: 'center',
    marginTop: DevicePixels[30],
  },
});
