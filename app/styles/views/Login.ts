import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    margin: 10,
  },
  appleButton: {
    marginVertical: 10,
    width: 250,
    height: 45,
  },
  button: {
    margin: 10,
  },
  icon: {
    marginRight: 10,
    color: colors.appBlue,
  },
  logo: {
    margin: 10,
    marginTop: 60,
    height: 75,
    width: 75,
    alignSelf: 'center',
  },
});
