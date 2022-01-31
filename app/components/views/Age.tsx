import {View, Platform} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import DatePicker, {Event} from '@react-native-community/datetimepicker';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import DevicePixels from '../../helpers/DevicePixels';
import Button from '../commons/Button';

const Age: React.FC<{dob: string; setDob: (dob: string) => void}> = ({
  dob,
  setDob,
}) => {
  const [show, setShow] = useState(false);
  return (
    <View style={{marginTop: DevicePixels[40]}}>
      <Text
        category="h4"
        style={{textAlign: 'center', marginBottom: DevicePixels[20]}}>
        Whats your age?
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
        <Button onPress={() => setShow(true)}>Select date of birth</Button>
      )}
      {(show || Platform.OS === 'ios') && (
        <DatePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
          value={moment(dob).toDate()}
          onChange={(_: Event, d: Date) => {
            if (d) {
              setDob(d.toISOString());
            }
            setShow(Platform.OS === 'ios');
          }}
        />
      )}
    </View>
  );
};

export default Age;
