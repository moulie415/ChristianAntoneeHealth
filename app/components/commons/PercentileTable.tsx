import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import {PercentileTable as PercentileTableType} from '../../types/Test';
import Text from './Text';

const CELL_WIDTH = 100;

const Row: React.FC<{
  row: number;
  table: PercentileTableType;
  score: number;
}> = ({row, table, score}) => {
  const percentile = `${row}0th`;
  const nextPercentile = `${row + 1}0th`;
  const highlight =
    // @ts-ignore
    score > table[percentile] &&
    // @ts-ignore
    (!table[nextPercentile] ||
      // @ts-ignore
      score < table[nextPercentile]);

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
          color: colors.appBlue,
          borderColor: colors.appBlack,
          backgroundColor: colors.appWhite,
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
          backgroundColor: highlight ? colors.appBlue : undefined,
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
  score: number;
}> = ({table, title, score}) => {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <>
      <Text style={{color: colors.appWhite, marginBottom: 5, fontSize: 15}}>
        {title}
      </Text>
      {rows.map(row => {
        return <Row key={row} row={row} table={table} score={score} />;
      })}
    </>
  );
};

export default PercentileTable;
