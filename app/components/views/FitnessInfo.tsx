import {
  IndexPath,
  Input,
  Select,
  SelectItem,
  Button,
  Layout,
  Text,
} from '@ui-kitten/components';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Platform, TouchableOpacity} from 'react-native';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import DatePicker, {Event} from '@react-native-community/datetimepicker';
import {
  getDateOfBirth,
  getHeight,
  getSex,
  getWeight,
  initBiometrics,
  isAvailable,
  linkToGoogleFit,
} from '../../helpers/biometrics';
import FitnessInfoProps from '../../types/views/FitnessInfo';
import AbsoluteSpinner from '../commons/AbsoluteSpinner';
import colors from '../../constants/colors';

const FitnessInfo: React.FC<FitnessInfoProps> = ({
  height,
  setHeight,
  weight,
  setWeight,
  gender,
  setGender,
  dob,
  setDob,
  unit,
  setUnit,
  setStep,
}) => {
  const [show, setShow] = useState(false);
  const init = useCallback(async () => {
    setLoading(true);
    const available = await isAvailable();
    if (!available && Platform.OS === 'android') {
      Alert.alert(
        'Google Fit not installed',
        'While not required we recommend you install Google Fit to get the most out of Health and Movement',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Install Google Fit', onPress: linkToGoogleFit},
        ],
      );
      setLoading(false);
    } else if (Platform.OS === 'ios') {
      try {
        await initBiometrics();
        const h = await getHeight();
        setHeight(h);
        const w = await getWeight();
        setWeight(w);
        const sex = await getSex();
        setGender(sex);
        const dateOfBirth = await getDateOfBirth();
        if (dateOfBirth) {
          setDob(dateOfBirth);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Snackbar.show({text: `Error: ${e.message}`});
      }
    }
  }, [setDob, setGender, setHeight, setWeight]);

  useEffect(() => {
    init();
  }, [init]);

  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    new IndexPath(gender && gender === 'female' ? 1 : 0),
  );
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(
    new IndexPath(unit && unit === 'imperial' ? 1 : 0),
  );

  const [loading, setLoading] = useState(false);
  return (
    <Layout style={{marginHorizontal: 20}}>
      <Text style={{color: colors.textGrey}} category="label">
        Date of Birth
      </Text>
      {(show || Platform.OS === 'ios') && (
        <DatePicker
          style={{width: '100%', marginVertical: 5}}
          testID="datePicker"
          value={moment(dob).toDate()}
          mode="date"
          placeholderText="Select date"
          display="default"
          onChange={(_: Event, d: Date) => {
            if (d) {
              setDob(d.toISOString());
            }
            setShow(Platform.OS === 'ios');
          }}
        />
      )}
      {Platform.OS === 'android' && (
        <TouchableOpacity
          style={{
            width: '40%',
            marginVertical: 5,
            borderWidth: 1,
            padding: 7,
            borderRadius: 3,
            borderColor: '#ebebeb',
            backgroundColor: '#fafafa',
          }}
          onPress={() => setShow(true)}>
          <Text>{moment(dob).format('DD/mm/yyyy')}</Text>
        </TouchableOpacity>
      )}
      <Select
        style={{width: '65%'}}
        selectedIndex={selectedUnitIndex}
        onSelect={index => {
          setSelectedUnitIndex(index as IndexPath);
          if ('row' in index) {
            setUnit(index.row === 0 ? 'metric' : 'imperial');
          }
        }}
        value={unit || 'Select unit'}
        label="Unit">
        <SelectItem selected={unit === 'metric'} title="metric" />
        <SelectItem selected={unit === 'imperial'} title="imperial" />
      </Select>
      <Input
        value={weight?.toString()}
        returnKeyType="done"
        style={{width: '30%', marginRight: 20, marginTop: 10}}
        onChangeText={val => setWeight(Number(val))}
        label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`}
        keyboardType="numeric"
      />
      <Input
        value={height?.toString()}
        returnKeyType="done"
        style={{width: '30%', marginRight: 20, marginTop: 10}}
        onChangeText={val => setHeight(Number(val))}
        label={`Height (${unit === 'metric' ? 'cm' : 'inches'})`}
        keyboardType="numeric"
      />
      <Select
        style={{width: '65%', marginTop: 10}}
        selectedIndex={selectedGenderIndex}
        onSelect={index => {
          setSelectedGenderIndex(index as IndexPath);
          if ('row' in index) {
            setGender(index.row === 0 ? 'male' : 'female');
          }
        }}
        value={gender || 'Select gender'}
        label="Gender">
        <SelectItem selected={gender === 'male'} title="male" />
        <SelectItem selected={gender === 'female'} title="female" />
      </Select>
      <Text style={{color: '#fff', marginVertical: 20}}>
        This data will help us assess your fitness and exercise requirement. You
        can update this information anytime in your profile.
      </Text>
      <Button
        onPress={() => setStep(2)}
        disabled={!dob || !height || !weight || !gender}>
        Continue
      </Button>
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};

export default FitnessInfo;
