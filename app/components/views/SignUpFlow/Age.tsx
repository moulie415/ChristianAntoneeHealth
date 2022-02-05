import {View, Platform} from 'react-native';
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
    <View style={{marginTop: DevicePixels[40]}}>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginBottom: DevicePixels[20],
          width: DevicePixels[300],
        }}>
        What's your age?
      </Text>
      <Text
        category="h1"
        style={{
          color: colors.appBlue,
          textAlign: 'center',
          marginBottom: DevicePixels[20],
        }}>
        {moment().diff(dob, 'years')}
      </Text>
      {Platform.OS === 'android' && (
        <Button
          style={{width: DevicePixels[175], alignSelf: 'center'}}
          onPress={() => {
            setShow(true);
          }}>
          Select date of birth
        </Button>
      )}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[100],
          alignItems: 'center',
        }}>
        {(show || Platform.OS === 'ios') && (
          <DatePicker
            mode="date"
            style={{
              width: DevicePixels[250],
            }}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={moment(dob).toDate()}
            onChange={(_: Event, d: Date) => {
              setShow(Platform.OS === 'ios');
              setDob(d ? d.toISOString() : dob);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Age;
