import {Datepicker, Text, Toggle} from '@ui-kitten/components';
import React, {useState} from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';
import SettingsProps from '../../types/views/Settings';

const Settings: React.FC<SettingsProps> = () => {
  const [workoutReminders, setWorkoutReminders] = useState(true);
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text style={{margin: 10}} category="h5">
        Notifications
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        <Text>Workout reminders</Text>
        <Toggle checked={workoutReminders} onChange={setWorkoutReminders} />
      </View>
    </View>
  );
};

export default Settings;
