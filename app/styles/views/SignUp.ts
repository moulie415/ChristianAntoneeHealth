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
    color: '#fff',
    flex: 1,
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
    height: DevicePixels[75],
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    margin: DevicePixels[10],
  },
});
