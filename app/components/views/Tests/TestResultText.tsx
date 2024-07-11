import moment from 'moment';
import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import colors from '../../../constants/colors';
import {
  capitalizeFirstLetter,
  getCategoryString,
  getPercentile,
  getScoreIcon,
  getTableAverage,
  getTableCategory,
  getTableColumn,
} from '../../../helpers';
import {keyHasValue} from '../../../helpers/table';
import {Profile} from '../../../types/Shared';
import {PercentileTable, Table} from '../../../types/Test';

const TestResultText: React.FC<{
  profile: Profile;
  score: number;
  table: Table | PercentileTable;
}> = ({profile, table, score}) => {
  if (!profile.gender || !profile.dob) {
    return null;
  }

  const age = moment().diff(profile.dob, 'years');

  const percentile =
    '10th' in table && table['10th'] && getPercentile(table, score);
  const column =
    'age' in table && keyHasValue(table, 'age') && getTableColumn(table, age);
  const category =
    'age' in table &&
    column &&
    keyHasValue(table, 'age') &&
    getTableCategory(table, column, score);

  const average =
    'age' in table &&
    keyHasValue(table, 'age') &&
    column &&
    getTableAverage(table, column);
  return (
    <View style={{marginTop: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {!percentile && (
          <>
            {getScoreIcon(category || (percentile as string)) === '-' ? (
              <Text
                style={{
                  fontSize: 30,
                  marginRight: 10,
                  color: colors.appWhite,
                }}>
                -
              </Text>
            ) : (
              <Icon
                style={{
                  fontSize: 20,
                  marginRight: 10,
                  color: colors.appWhite,
                }}
                name={getScoreIcon((category || percentile) as string)}
              />
            )}
          </>
        )}
        <Text style={{color: colors.appWhite, fontSize: 18}}>
          {category
            ? `${getCategoryString(category)} score`
            : `${capitalizeFirstLetter(percentile as string)} percentile`}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 20,
        }}>
        <Icon
          style={{
            fontSize: 20,
            marginHorizontal: 10,
            color: colors.appWhite,
          }}
          name="gauge-high"
        />
        <Text
          style={{
            fontSize: 16,
            flex: 1,
            color: colors.appWhite,
          }}>
          {category ? 'You score is ' : 'You scored in the '}
          <Text style={{fontWeight: 'bold'}}>
            {category ? getCategoryString(category) : `${[percentile]}`}
          </Text>
          {category
            ? ` for men of your age (${age}). `
            : ' percentile for men. '}
          {average ? (
            <Text>{`The average for men of your age is between ${average.lower} and ${average.higher}`}</Text>
          ) : (
            <Text>
              {percentile === 'bottom'
                ? ''
                : `This means you scored higher than ${
                    percentile && percentile.replace('th', '')
                  }% of men`}
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = (state: RootState) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToProps)(TestResultText);
