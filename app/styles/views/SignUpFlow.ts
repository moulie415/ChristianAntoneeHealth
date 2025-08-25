import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    margin: 10,
    marginTop: 60,
    height: 75,
    width: 75,
    alignSelf: 'center',
  },
  icon: {
    color: colors.appBlue,
  },
  input: {
    width: 225,
  },
});
