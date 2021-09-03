import {Text} from '@ui-kitten/components';
import React, {useMemo} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Table as TableType} from '../../types/Test';
import {Row as RowType} from '../../types/Test';

const CELL_WIDTH = 100;

const Table: React.FC<{table: TableType; title?: string; metric?: string}> = ({
  table,
  title,
  metric,
}) => {
  const {tableHead, tableData} = useMemo(() => {
    const getRowArr = (row: RowType, showMetric = true) => {
      return Object.values(row)
        .reverse()
        .map(col => {
          const metricStr = showMetric && metric ? metric : '';
          if (col.lower && col.higher) {
            return `${col.lower} - ${col.higher}${metricStr}`;
          }
          if (col.lower) {
            return `> ${col.lower}${metricStr}`;
          }
          return `< ${col.higher}${metricStr}`;
        });
    };
    const head = ['Age', ...getRowArr(table.age, false)];
    const data = [];

    table.excellent && data.push(['Excellent', ...getRowArr(table.excellent)]);

    table.good && data.push(['Good ', ...getRowArr(table.good)]);

    table.aboveAverage &&
      data.push(['Above average', ...getRowArr(table.aboveAverage)]);

    table.average && data.push(['Average', ...getRowArr(table.average)]);

    table.belowAverage &&
      data.push(['Below average', ...getRowArr(table.belowAverage)]);

    table.poor && data.push(['Poor', ...getRowArr(table.poor)]);

    table.veryPoor && data.push(['Very poor', ...getRowArr(table.veryPoor)]);
    return {
      tableHead: head,
      tableData: data,
    };
  }, [table, metric]);

  return (
    <>
      {title && (
        <Text style={{marginHorizontal: 10, marginTop: 10}} category="s1">
          {title}
        </Text>
      )}
      <ScrollView horizontal style={{paddingVertical: 10, marginHorizontal: 10}}>
        <View>
          <View style={{flexDirection: 'row'}}>
            {tableHead.map(cell => (
              <Text
                key={cell}
                style={{
                  padding: 2,
                  borderWidth: StyleSheet.hairlineWidth,
                  width: CELL_WIDTH,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 12,
                }}>
                {cell}
              </Text>
            ))}
          </View>
          {tableData.map(row => {
            return (
              <View key={row[0]} style={{flexDirection: 'row'}}>
                {row.map((cell, index) => (
                  <Text
                    key={cell}
                    style={{
                      padding: 2,
                      borderWidth: StyleSheet.hairlineWidth,
                      width: CELL_WIDTH,
                      textAlign: 'center',
                      fontWeight: index === 0 ? 'bold' : 'normal',
                      fontSize: 12,
                    }}>
                    {cell}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

        <View />
      </ScrollView>
    </>
  );
};

export default Table;
