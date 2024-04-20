import moment from 'moment';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import {TABLE_HEADER_KEYS} from '../../constants';
import colors from '../../constants/colors';
import {keyHasValue} from '../../helpers/table';
import {Profile} from '../../types/Shared';
import {Table as TableType} from '../../types/Test';
import Text from './Text';

const CELL_WIDTH = 65;

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
    // backgroundColor: isAgeIndex ? colors.appBlue : undefined,
    color: colors.appWhite,
  },
  cellHeader: {
    backgroundColor: colors.appWhite,
    color: colors.appBlue,
    borderColor: colors.appBlack,
  },
});

const Table: React.FC<{
  table: TableType;
  title: string;
  metric?: string;
  profile: Profile;
  score: number;
}> = ({table, title, metric, profile, score}) => {
  const colHasValue = (col: {lower: string; higher: string}) => {
    return col.lower || col.higher;
  };

  const cols = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6'];

  const validHeaderKeys = TABLE_HEADER_KEYS.filter(key =>
    keyHasValue(table, key),
  );

  const getCellValue = (col: {higher: string; lower: string}, key: string) => {
    const metricStr = metric && key !== 'age' ? metric : '';
    if (col.lower && col.higher) {
      return `${col.lower} - ${col.higher}${metricStr}`;
    }
    if (col.lower) {
      return `> ${col.lower}${metricStr}`;
    }
    return `< ${col.higher}${metricStr}`;
  };

  const age = profile.dob && moment().diff(profile.dob, 'years');

  const shouldHighlight = (colKey: string, key: string) => {
    // @ts-ignore
    const col = table[key][colKey];
    // @ts-ignore
    const ageCol = table.age[colKey];
    return (
      age &&
      (!col.higher || score <= Number(col.higher)) &&
      (!col.lower || score >= Number(col.lower)) &&
      (!ageCol.higher || age <= Number(ageCol.higher)) &&
      (!ageCol.lower || age >= Number(ageCol.lower))
    );
  };

  return (
    <>
      <Text style={{color: colors.appWhite, marginBottom: 5, fontSize: 15}}>
        {title}
      </Text>
      <ScrollView
        horizontal
        style={{
          paddingVertical: 10,
          marginHorizontal: 10,
        }}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.cell, styles.cellHeader]}>Age</Text>
            {keyHasValue(table, 'veryPoor') && (
              <Text style={[styles.cell, styles.cellHeader]}>Very Poor</Text>
            )}
            {keyHasValue(table, 'poor') && (
              <Text style={[styles.cell, styles.cellHeader]}>Poor</Text>
            )}
            {keyHasValue(table, 'belowAverage') && (
              <Text style={[styles.cell, styles.cellHeader]}>
                Below Average
              </Text>
            )}
            {keyHasValue(table, 'average') && (
              <Text style={[styles.cell, styles.cellHeader]}>Average</Text>
            )}
            {keyHasValue(table, 'aboveAverage') && (
              <Text style={[styles.cell, styles.cellHeader]}>
                Above Average
              </Text>
            )}
            {keyHasValue(table, 'good') && (
              <Text style={[styles.cell, styles.cellHeader]}>Good</Text>
            )}
            {keyHasValue(table, 'excellent') && (
              <Text style={[styles.cell, styles.cellHeader]}>Excellent</Text>
            )}
          </View>
          {cols.map((col, index) => {
            return (
              <View
                key={col + index}
                style={{
                  flexDirection: 'row',
                }}>
                {validHeaderKeys.map((key, i) => {
                  // @ts-ignore
                  if (table[key] && colHasValue(table[key][col])) {
                    const highlight = shouldHighlight(col, key);
                    return (
                      <Text
                        key={key}
                        style={[
                          styles.cell,
                          i === 0 ? styles.cellHeader : {},
                          highlight
                            ? {
                                backgroundColor: colors.appBlue,
                              }
                            : {},
                        ]}>
                        {/* @ts-ignore */}
                        {getCellValue(table[key][col], key)}
                      </Text>
                    );
                  }
                  return null;
                })}
              </View>
            );
          })}
        </View>

        <View />
      </ScrollView>
    </>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Table);
