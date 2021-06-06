import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  title: {
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBlack,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
