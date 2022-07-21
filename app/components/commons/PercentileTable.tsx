import React from 'react';
import {View, StyleSheet} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import {PercentileTable as PercentileTableType} from '../../types/Test';
import Text from './Text';

const CELL_WIDTH = 100;

const Row: React.FC<{percentile: string; table: PercentileTableType}> = ({
  percentile,
  table,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          padding: DevicePixels[2],
          borderWidth: StyleSheet.hairlineWidth,
          width: CELL_WIDTH,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: DevicePixels[12],
        }}>
        {percentile}
      </Text>
      <Text
        style={{
          padding: DevicePixels[2],
          borderWidth: StyleSheet.hairlineWidth,
          width: CELL_WIDTH,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: DevicePixels[12],
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
  return (
    <View style={{margin: DevicePixels[10]}}>
      {title && (
        <Text
          style={{
            margin: DevicePixels[10],
          }}>
          {title}
        </Text>
      )}
      <Row percentile="90th" table={table} />
      <Row percentile="80th" table={table} />
      <Row percentile="70th" table={table} />
      <Row percentile="60th" table={table} />
      <Row percentile="50th" table={table} />
      <Row percentile="40th" table={table} />
      <Row percentile="30th" table={table} />
      <Row percentile="20th" table={table} />
      <Row percentile="10th" table={table} />
    </View>
  );
};

export default PercentileTable;
