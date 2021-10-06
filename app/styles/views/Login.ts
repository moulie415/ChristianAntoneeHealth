import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: DevicePixels[20],
    textAlign: 'center',
    margin: DevicePixels[10],
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: DevicePixels[5],
  },
  input: {
    margin: DevicePixels[10],
  },
  appleButton: {
    marginVertical: DevicePixels[10],
    width: DevicePixels[250],
    height: DevicePixels[45],
  },
  button: {
    margin: DevicePixels[10],
  },
  icon: {
    marginRight: DevicePixels[10],
    color: colors.appBlue,
  },
  logo: {
    margin: DevicePixels[10],
    marginTop: DevicePixels[60],
    height: DevicePixels[75],
    width: DevicePixels[75],
    alignSelf: 'center',
  },
});
