import moment from 'moment';
import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
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
  //

  const keyHasValue = (key: string) => {
    for (let i = 0; i < 6; i++) {
      // @ts-ignore
      if (table[key][`col${i + 1}`].lower || table[key][`col${i + 1}`].higher) {
        return true;
      }
    }
    return false;
  };

  const colHasValue = (col: {lower: string; higher: string}) => {
    return col.lower || col.higher;
  };

  const cols = ['col1', 'col2', 'col3', 'col4', 'col4', 'col5', 'col6'];

  const headerKeys = [
    'age',
    'veryPoor',
    'poor',
    'belowAverage',
    'average',
    'aboveAverage',
    'good',
    'excellent',
  ];

  const validHeaderKeys = headerKeys.filter(key => keyHasValue(key));

  const getCellValue = (col: {higher: string; lower: string}) => {
    const metricStr = metric ? metric : '';
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
      <ScrollView
        horizontal
        style={{
          paddingVertical: 10,
          marginHorizontal: 10,
        }}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.cell, styles.cellHeader]}>Age</Text>
            {keyHasValue('veryPoor') && (
              <Text style={[styles.cell, styles.cellHeader]}>Very Poor</Text>
            )}
            {keyHasValue('poor') && (
              <Text style={[styles.cell, styles.cellHeader]}>Poor</Text>
            )}
            {keyHasValue('belowAverage') && (
              <Text style={[styles.cell, styles.cellHeader]}>
                Below Average
              </Text>
            )}
            {keyHasValue('average') && (
              <Text style={[styles.cell, styles.cellHeader]}>Average</Text>
            )}
            {keyHasValue('aboveAverage') && (
              <Text style={[styles.cell, styles.cellHeader]}>
                Above Average
              </Text>
            )}
            {keyHasValue('good') && (
              <Text style={[styles.cell, styles.cellHeader]}>Good</Text>
            )}
            {keyHasValue('excellent') && (
              <Text style={[styles.cell, styles.cellHeader]}>Excellent</Text>
            )}
          </View>
          {cols.map((col, index) => {
            return (
              <View
                key={Math.random()}
                style={{
                  flexDirection: 'row',
                }}>
                {validHeaderKeys.map((key, i) => {
                  // @ts-ignore
                  if (table[key] && colHasValue(table[key][col])) {
                    const highlight = shouldHighlight(col, key);
                    return (
                      <Text
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
                        {getCellValue(table[key][col])}
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

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Table);
