import moment from 'moment';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import colors from '../../constants/colors';
import {keyHasValue} from '../../helpers/table';
import {Profile} from '../../types/Shared';
import {Cell, Row, Table as TableType} from '../../types/Test';
import Text from './Text';

const CELL_WIDTH = 50;

const styles = StyleSheet.create({
  cell: {
    padding: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.appWhite,
    width: CELL_WIDTH,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    textAlignVertical: 'center',
    color: colors.appWhite,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  cellHeader: {
    backgroundColor: colors.appWhite,
    color: colors.appBlue,
    borderColor: colors.appBlack,
    width: CELL_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    paddingVertical: 5,
  },
});

export const TABLE_HEADER_KEYS: (keyof TableType)[] = [
  'age',
  'veryPoor',
  'poor',
  'belowAverage',
  'average',
  'aboveAverage',
  'good',
  'excellent',
];

const headerKeyMapping: {[key: string]: string} = {
  veryPoor: 'Very Poor',
  poor: 'Poor',
  belowAverage: 'Below Average',
  average: 'Average',
  aboveAverage: 'Above Average',
  good: 'Good',
  excellent: 'Excellent',
};

const Table: React.FC<{
  table: TableType;
  title: string;
  metric?: string;
  profile: Profile;
  score: number;
}> = ({table, title, metric, profile, score}) => {
  const colHasValue = (col?: Cell) => {
    return col && (col.lower || col.higher);
  };

  const cols: (keyof Row)[] = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6'];

  const validHeaderKeys = TABLE_HEADER_KEYS.filter(key =>
    keyHasValue(table, key),
  );

  const getCellValue = (key: string, col?: Cell) => {
    if (!col || !(col.higher || col.lower)) {
      return null;
    }
    const metricStr = metric && key !== 'age' ? metric : '';
    if (col.lower && col.higher) {
      return `${col.lower} - ${col.higher}${metricStr}`;
    }
    if (col.lower) {
      return `> ${Number(col.lower) - 1}${metricStr}`;
    }
    return `< ${Number(col.higher) + 1}${metricStr}`;
  };

  const age = profile.dob && moment().diff(profile.dob, 'years');

  const shouldHighlight = (colKey: keyof Row, key: keyof TableType) => {
    const col = table[key]?.[colKey];
    const ageCol = table.age[colKey];
    return (
      age &&
      ageCol &&
      col &&
      (!col.higher || score <= Number(col.higher)) &&
      (!col.lower || score >= Number(col.lower)) &&
      (!ageCol.higher || age <= Number(ageCol.higher)) &&
      (!ageCol.lower || age >= Number(ageCol.lower))
    );
  };

  const ageHeaders = cols
    .map(col =>
      getCellValue(validHeaderKeys[0], table[validHeaderKeys[0]]?.[col]),
    )
    .filter(h => h);

  return (
    <>
      <Text
        style={{
          color: colors.appWhite,
          margin: 20,
          fontWeight: 'bold',
          fontSize: 15,
          marginBottom: 10,
        }}>
        {title}
      </Text>

      <View style={{alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.cell,
              styles.cellHeader,
              {
                width: CELL_WIDTH + 20,
              },
            ]}>
            Age
          </Text>
          {ageHeaders.map(header => {
            return (
              <Text key={header} style={[styles.cell, styles.cellHeader]}>
                {header}
              </Text>
            );
          })}
        </View>
        {validHeaderKeys.slice(1).map(key => {
          return (
            <View key={key} style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.cell,
                  styles.cellHeader,
                  {width: CELL_WIDTH + 20},
                ]}>
                {headerKeyMapping[key]}
              </Text>
              {cols.map(col => {
                if (table[key] && colHasValue(table[key]?.[col])) {
                  const highlight = shouldHighlight(col, key);
                  return (
                    <Text
                      key={key + col}
                      style={[
                        styles.cell,
                        highlight
                          ? {
                              backgroundColor: colors.appBlue,
                            }
                          : {},
                      ]}>
                      {getCellValue(key, table[key]?.[col])}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          );
        })}
      </View>
    </>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Table);
