import {StyleSheet} from 'react-native';
import colors from '../constants/colors';

export default StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  textShadow: {
    textShadowColor: '#000',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});
