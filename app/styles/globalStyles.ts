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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textShadow: {
    textShadowColor: '#000',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
