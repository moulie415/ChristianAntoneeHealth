import moment from 'moment';
import React, {useMemo, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {connect} from 'react-redux';
import colors from '../../constants/colors';

import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import {Cell, Table as TableType} from '../../types/Test';
import {Row as RowType} from '../../types/Test';
import Text from './Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Divider from './Divider';

const CELL_WIDTH = 100;

const Table: React.FC<{
  table: TableType;
  title: string;
  metric?: string;
  profile: Profile;
}> = ({table, title, metric, profile}) => {
  const [collapsed, setCollapsed] = useState(true);
  const {tableHead, tableData, ageIndex} = useMemo(() => {
    let aIndex;
    const getRowArr = (
      row: RowType,
      showMetric = true,
      findAgeIndex = false,
    ) => {
      return Object.keys(row)
        .sort((a, b) => {
          return Number(a[3]) - Number(b[3]);
        })
        .map((key, index) => {
          // @ts-ignore
          const col = row[key];

          if (findAgeIndex) {
            const age = profile.dob && moment().diff(profile.dob, 'years');
            if (age) {
              if (
                (!col.higher || age <= Number(col.higher)) &&
                (!col.lower || age >= Number(col.lower))
              ) {
                aIndex = index;
              }
            }
          }

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
    const head = ['Age', ...getRowArr(table.age, false, true)];
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
      ageIndex: aIndex,
    };
  }, [table, metric, profile.dob]);

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
            fontWeight: 'bold',
          }}>
          {title || 'Table'}
        </Text>
        <Icon
          style={{padding: 10}}
          name={collapsed ? 'plus' : 'minus'}
          color={colors.appWhite}
          size={20}
        />
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <ScrollView
          horizontal
          style={{
            paddingVertical: 10,
            marginHorizontal: 10,
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              {tableHead.map((cell, index) => {
                const shiftedIndex = index - 1;
                const isAgeIndex =
                  ageIndex !== undefined && shiftedIndex === ageIndex;
                return (
                  <Text
                    key={Math.random()}
                    style={{
                      padding: 2,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: colors.appWhite,
                      width: CELL_WIDTH,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12,
                      backgroundColor: isAgeIndex ? colors.appBlue : undefined,
                      color: colors.appWhite,
                    }}>
                    {cell}
                  </Text>
                );
              })}
            </View>
            {tableData.map(row => {
              return (
                <View key={row[0]} style={{flexDirection: 'row'}}>
                  {row.map((cell, index) => (
                    <Text
                      key={Math.random()}
                      style={{
                        padding: 2,
                        borderColor: colors.appWhite,
                        borderWidth: StyleSheet.hairlineWidth,
                        width: CELL_WIDTH,
                        textAlign: 'center',
                        fontWeight: index === 0 ? 'bold' : 'normal',
                        fontSize: 12,
                        color: colors.appWhite,
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
      </Collapsible>
      <Divider />
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Table);
