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
    color: '#fff',
    flex: 1,
  },
  inputGrp: {
    flexDirection: 'row',
    backgroundColor: '#0005',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: 'transparent',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    color: '#fff',
  },
  logo: {
    margin: 10,
    marginTop: 60,
    height: 75,
    width: 75,
    alignSelf: 'center',
  },
  button: {
    margin: 10,
  },
});
