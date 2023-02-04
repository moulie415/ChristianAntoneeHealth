import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';

import {PercentileTable as PercentileTableType} from '../../types/Test';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from './Text';
import Collapsible from 'react-native-collapsible';
import Divider from './Divider';

const CELL_WIDTH = 100;

const Row: React.FC<{percentile: string; table: PercentileTableType}> = ({
  percentile,
  table,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          padding: 2,
          borderWidth: StyleSheet.hairlineWidth,
          width: CELL_WIDTH,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 12,
          color: colors.appWhite,
          borderColor: colors.appWhite,
        }}>
        {percentile}
      </Text>

      <Text
        style={{
          padding: 2,
          borderWidth: StyleSheet.hairlineWidth,
          width: CELL_WIDTH,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 12,
          color: colors.appWhite,
          borderColor: colors.appWhite,
        }}>
        {/* @ts-ignore */}
        {table[percentile]}
      </Text>
    </View>
  );
};

const PercentileTable: React.FC<{
  table: PercentileTableType;
  title: string;
}> = ({table, title}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            margin: 10,
            color: colors.appWhite,
          }}>
          {title || 'Percentile table'}
        </Text>
        <Icon
          style={{padding: 10}}
          name={collapsed ? 'plus' : 'minus'}
          color={colors.appWhite}
          size={20}
        />
      </TouchableOpacity>
      <Collapsible style={{marginLeft: 10}} collapsed={collapsed}>
        <Row percentile="90th" table={table} />
        <Row percentile="80th" table={table} />
        <Row percentile="70th" table={table} />
        <Row percentile="60th" table={table} />
        <Row percentile="50th" table={table} />
        <Row percentile="40th" table={table} />
        <Row percentile="30th" table={table} />
        <Row percentile="20th" table={table} />
        <Row percentile="10th" table={table} />
      </Collapsible>
      <Divider />
    </>
  );
};

export default PercentileTable;
