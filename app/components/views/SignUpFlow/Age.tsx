import {View, Platform, ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import moment from 'moment';
import DatePicker, {Event} from '@react-native-community/datetimepicker';
import colors from '../../../constants/colors';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import Button from '../../commons/Button';

const Age: React.FC<{
  dob: string;
  setDob: (dob: string) => void;
  setShowDatePicker: (show: boolean) => void;
  showDatePicker: boolean;
}> = ({dob, setDob, setShowDatePicker: setShow, showDatePicker: show}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        margin: DevicePixels[40],
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: DevicePixels[20],
          fontSize: DevicePixels[20],
          color: colors.appWhite,
        }}>
        What's your age?
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          marginBottom: DevicePixels[20],
          fontSize: DevicePixels[30],
          fontWeight: 'bold',
        }}>
        {moment().diff(dob, 'years')}
      </Text>
      {Platform.OS === 'android' && (
        <Button
          style={{alignSelf: 'center'}}
          text="Select date of birth"
          onPress={() => {
            setShow(true);
          }}
        />
      )}

      {(show || Platform.OS === 'ios') && (
        <DatePicker
          mode="date"
          style={{}}
          textColor={colors.appWhite}
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={moment(dob).toDate()}
          onChange={(event, d: Date) => {
            setShow(Platform.OS === 'ios');
            setDob(d ? d.toISOString() : dob);
          }}
        />
      )}
    </View>
  );
};

export default Age;
