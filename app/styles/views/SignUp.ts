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
    borderWidth: 0,
    marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: DevicePixels[1],
    paddingLeft: DevicePixels[10],
    height: DevicePixels[50],
    color: '#fff',
  },
  inputGrp: {
    flexDirection: 'row',
    backgroundColor: '#0005',
    marginBottom: DevicePixels[20],
    borderWidth: 0,
    borderColor: 'transparent',
    marginLeft: DevicePixels[20],
    marginRight: DevicePixels[20],
    paddingLeft: DevicePixels[10],
    borderRadius: DevicePixels[5],
    height: DevicePixels[50],
    alignItems: 'center',
  },
  icon: {
    marginRight: DevicePixels[10],
    color: '#fff',
  },
  logo: {
    margin: DevicePixels[10],
    marginTop: DevicePixels[60],
    alignSelf: 'center',
    height: DevicePixels[27],
    width: DevicePixels[250],
    tintColor: colors.appWhite,
  },
  button: {
    margin: DevicePixels[10],
    marginBottom: DevicePixels[5],
    height: DevicePixels[50],
  },
});
