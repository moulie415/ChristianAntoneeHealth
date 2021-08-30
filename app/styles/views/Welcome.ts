import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../constants/colors';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  logo: {
    margin: 10,
    marginTop: 100,
    marginBottom: 60,
    height: 75,
    width: 75,
    alignSelf: 'center',
  },
  versionNumber: {
    textAlign: 'center',
    marginTop: 30,
  },
});
