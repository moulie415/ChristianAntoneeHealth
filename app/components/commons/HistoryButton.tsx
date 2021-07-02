import React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from '../../styles/commons/HistoryButton';
import HistoryButtonProps from '../../types/commons/HistoryButton';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HistoryButton: React.FC<HistoryButtonProps> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.container}>
      <Icon name="history" size={20} />
    </TouchableOpacity>
  );
};

export default HistoryButton;
